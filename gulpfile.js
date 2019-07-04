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
gulp.task('default',function(callback){
    var config = Object.create(webpackConfig)

    config.devtool = "eval-sourcemap";
    config.debug = true;
    config.plugins = config.plugins ||[];

    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        mangle: {
            except: ['$', 'exports', 'require']
        }
    }))

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

gulp.task('dev-server',function(cb){
    var config = Object.create(webpackConfig);
    for(var i in config.entry) {
        var eItem = config.entry[i]
        eItem.unshift("webpack/hot/dev-server")
        eItem.unshift('webpack-dev-server/client?http://0.0.0.0:8080')
        console.log(eItem)
    }
    config.debug = true;
    config.devtool = 'sourcemap'
    config.output.sourceMapFilename='[name].map'


    config.plugins = config.plugins ||[];
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
    new WebpackDevServer(webpack(config),{
        publicPath:config.output.publicPath,
        stats:{
            colors:true
        }
    }).listen(8080,'localhost',function(err){
            if(err) throw new gutil.PluginError('dev-server',err);
        })
})

gulp.task('extends-server',function(cb){
    var config = require('./webpack.config.extends.js');
    for(var i in config.entry) {
        var eItem = config.entry[i]
        eItem.unshift("webpack/hot/dev-server")
        eItem.unshift('webpack-dev-server/client?http://0.0.0.0:8080')
        console.log(eItem)
    }
    config.debug = true;
    config.devtool = 'eval'
    config.output.sourceMapFilename='[name].map'


    config.plugins = config.plugins ||[];
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
    new WebpackDevServer(webpack(config),{
        publicPath:config.output.publicPath,
        stats:{
            colors:true
        }
    }).listen(8080,'localhost',function(err){
            if(err) throw new gutil.PluginError('dev-server',err);
        })
})

