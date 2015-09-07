var path = require('path'),
    webpack = require('webpack');

// TODO: 需要解决commons未变, app改变编译后commons hash变的问题
//       https://github.com/webpack/webpack/issues/1315

// Plugins
var Clean = require('clean-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

var ManifestRevisionPlugin = require('./webpack/manifest-revision-plugin');

var nodeModulesPath = path.resolve(__dirname, 'node_modules'),
    rootPath = path.resolve(__dirname, 'coalink'),
    rootAssetsRelativePath = './coalink/assets',
    rootAssetsPath = path.resolve(__dirname, rootAssetsRelativePath),
    manifestPath = path.resolve(rootAssetsPath, 'manifest'),
    buildOutputPath = path.join(rootPath, 'static');

// 开发时，由webpack-dev-server来提供的static文件，页面由后端web server提供。
var manifestFile = 'manifest-dev.json',
    publicPath = 'http://localhost:10086/static/',
    cleanFiles = [];

if (process.env.NODE_ENV === 'production') {
    manifestFile = 'manifest.json';
    publicPath = '/static/';
    cleanFiles = ['static', 'assets/manifest/' + manifestFile];
} else {
    cleanFiles = ['assets/manifest/' + manifestFile];
}

config = {
    // 设置entry解析的根路径
    context: rootAssetsPath,
    entry: {
        // base.css中包括了所有页面都需要使用的基础样式
        base: ['./styles/base.less'],

        // commons中包括了公用的第三方库、自己开发库及库的初始化代码。
        commons: ['./commons'],

        // 各个主页面的入口模块
        main: ['./pages/main/'],
        maincss: ['./pages/main/styles/index.less'],

        // admin后台管理入口
        admin: ["./pages/admin/index"],
        admincss: ['./pages/admin/styles/index.less']
    },
    output: {
        path: buildOutputPath,
        publicPath: publicPath,
        filename: '[name]-[chunkhash].js',
        chunkFilename: '[name].[id]-[chunkhash].js'
    },
    // 在本地开发调试时，启动webpack-dev-server的参数
    devServer: {
        contentBase: buildOutputPath,
        port: 10086,
        inline: true
    },
    module: {
        loaders: [
            // 将ES6/7语法，及React JSX转换成js。
            {
                test: /\.(js|jsx)?$/, loader: 'babel',
                exclude: [nodeModulesPath]
            },

            // 将初始chunk中的css以css文件的方式，其他chunk采取css嵌入在js中的方式。
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css!less')
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!sass')
            },

            // 对图片的处理，对小于8K图片采用dataUrl的方式。
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loader: 'url?limit=8192&name=imgs/[name]-[hash].[ext]'
            },

            // 对字体的处理，小于25K的woff格式的字体采取dataUrl的方式，其他采用file方式。
            {
                test: /\.(woff)$/,
                loader: 'url?limit=25000&name=fonts/[name]-[hash].[ext]'
            },
            {
                test: /\.(woff2|ttf|eot|svg)$/,
                loader: 'file?name=fonts/[name]-[hash].[ext]'
            },
            {
                test: /\.(mp4|mpeg|webm|ogv)$/,
                loader: 'file?name=video/[name]-[hash:10].[ext]'
            }
        ]
    },
    resolve: {
        // 如果第三方库的package.json中，main指向的是minified的文件，则需要通过添加
        // alias指定未minified的源代码，以供webpack使用。
        alias: {
        },
        // require('file')时自动添加的扩展名，仅添加js相关的扩展名。
        // 其他类型如img，css等显示指定，以避免同名的冲突，如index.js, index.css。
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        // 有错误时停止生成文件
        new webpack.NoErrorsPlugin(),

        // 在production编译时，清空生成static目录中的文件及manifest文件，确保只保留最新版本。
        // 否则只清空manifest文件。
        new Clean(cleanFiles, rootPath),

        // 将第三方库作为公用的chunk
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons', minChunks: Infinity
        }),

        // 给js中剥离的css的文件指定名称
        new ExtractTextPlugin('[name]-[contenthash].css'),

        // assets生成后，将includePaths中指定目录的assets的映射信息写入到manifest
        // 中，用于在Flask的模板页面中引用assets.
        new ManifestRevisionPlugin(path.join(manifestPath, manifestFile), {
            rootAssetPath: rootAssetsRelativePath,
            includePaths: [
                'images/*', 'pages/**/images/*', 'pages/**/video/*',
            ]
        })
    ]
};

module.exports = config;
