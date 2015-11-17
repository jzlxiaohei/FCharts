var webpack = require('webpack');
var path = require('path')

module.exports = {
    cache:true,
    entry:{
        ChartExtends:['./extends/index.js']
    },
    output:{
        path:path.join(__dirname,'build'),
        filename:'[name].js',
        publicPath:'/build/',
        library:'ChartExtends',
        libraryTarget:'umd'
    },
    plugins: [],
    module:{
        loaders:[
            {
                test:/\.js?$/,
                //exclude:'/node_modules/',
                loader:'babel',
                include:[path.resolve(__dirname, "src"),path.resolve(__dirname,'extends')],
                query: {}//{ optional: ['runtime']}
            }
        ]
    }
}