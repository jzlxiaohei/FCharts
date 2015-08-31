var gulp = require('gulp')
var gutil = require('gulp-util');

//var mocha = require('gulp-mocha');
//var babel = require('babel/register');
//gulp.task('mocha', function() {
//    return gulp.src(['test/**/*.js'])
//        .pipe(mocha({
//            compilers: {
//                js: babel
//            }
//        }));
//});

//webpack
var webpack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require('./webpack.config.js');
gulp.task('webpack-build',function(callback){
    var config = Object.create(webpackConfig)

    config.devtool = "sourcemap";
    config.debug = true;
    webpack(config,function(err,stats){
        if(err) {
            throw new gutil.PluginError("webpack-build", err);
        }
        //gutil.log("[webpack:build]", stats.toString({
        //    colors: true
        //}));
        if(typeof callback=='function'){
            callback();
        }
    })
})

gulp.task('webpack-dev-server',function(cb){
    var config = Object.create(webpackConfig);
    config.debug = true;
    config.devtool = 'source-map'
    config.output.sourceMapFilename='[name].map'

    new WebpackDevServer(webpack(config),{
        publicPath:config.output.publicPath,
        stats:{
            colors:true
        }
    }).listen(8080,'localhost',function(err){
            if(err) throw new gutil.PluginError('webpack-dev-server',err);
        })
})

