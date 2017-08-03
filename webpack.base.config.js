const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

/**
 * 这里提取 webpack 2 的 hash 插件生成稳定的 hash 值，不再依赖其他插件
 * 如果升级到 webpack 2，这个引用可以删掉，plugin 里进行相应修改
 * 现在 webpack runtime 和 commons 文件分离，这样只要不升级第三方库，commons.js 的 hash 将不变，获得长期 cache
 *
 * runtime(即 manifest.js) 文件只有 1kb，可以用 inline-manifest-webpack-plugin 将内容放到 html 里，减少一次请求
 * 但考虑嵌入旧框架内代码环境不清楚，暂不在公共配置中使用。可以在具体项目内加上这个插件
 * 参考 https://sebastianblade.com/using-webpack-to-achieve-long-term-cache/
 */
const HashedModuleIdsPlugin = require('./src/common/utils/HashedModuleIdsPlugin');
const config = require('./config');

const { __DEV__, __PROD__, __TEST__ } = config.globals;
let buildRunning = false;
let startTime = 0;

const webpackConfig = {
    entry: {},
    resolve: {
        alias: {
            '~static': path.join(__dirname, 'src', 'comm', 'public'),
            '~comm': path.join(__dirname, 'src', 'common'),
        },
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx'],
    },
    module: {
        loaders: [{
            test: /\.json$/,
            loader: "json-loader"
        }, {
            test: /\.jsx?$/,
            loader: 'babel',
            exclude: [/node_modules/, './www/comm/public'],
        }, {
            test: /\.less$/,
            loaders: ['style', 'css', 'postcss', 'less'],
        }, {
            test: /\.css$/,
            loaders: ['style', 'css', 'postcss'],
        }, {
            test: /\.(jpg|png|gif)$/,
            loader: 'url?limit=10000&name=images/[name].[ext]'
                // exclude: /node_modules/,
        }, {
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loader: 'file?name=fonts/[hash].[ext]',
        }, {
            test: /\.html/,
            loader: 'html',
            query: {
                minimize: false,
            },
        }],
    },
    plugins: [
        new webpack.DefinePlugin(config.globals),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        new webpack.ProgressPlugin((percentage, msg) => {
            const stream = process.stderr;

            if (!buildRunning) {
                buildRunning = true;
                startTime = new Date();
            } else if (stream.isTTY && percentage < 0.71) {
                stream.cursorTo(0);
                stream.write(`📦  ${chalk.magenta(msg)}`);
                stream.clearLine(1);
            } else if (percentage === 1) {
                const now = new Date();
                const buildTime = `${(now - startTime) / 1000}s`;
                console.log(chalk.green(`\nwebpack: bundle build completed in ${buildTime}.`));

                buildRunning = false;
            }
        }),
    ],
};

if (__DEV__) {
    webpackConfig.output = {
        filename: 'js/[name].js',
        publicPath: '/',
    };
    webpackConfig.devtool = '#source-map';
    webpackConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    );
} else if (__PROD__) {
    webpackConfig.entry.commons = config.vendors;
    webpackConfig.output = {
        filename: 'js/[name]-[chunkhash].js',
        chunkFilename: 'js/[name]-[chunkhash].js',
    };
    // webpackConfig.devtool = '#source-map';
    webpackConfig.plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin(),
        new HashedModuleIdsPlugin(),
        new ParallelUglifyPlugin({
            uglifyJS: {
                sourceMap: false,
                compress: {
                    unused: true,
                    dead_code: true,
                    warnings: false,
                    pure_funcs: ['console.log'],
                    // drop_console: true,
                    drop_debugger: true,
                },
            },
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                discardComents: {
                    removeAll: true,
                },
            },
        })
    );
}

if (!__TEST__) {
    if (__DEV__) {
        webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
            names: ['commons', 'manifest'],
            filename: 'js/[name].js',
        }));
    } else {
        webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
            names: ['commons', 'manifest'],
            filename: 'js/[name]-[chunkhash].js',
        }));
    }
}

if (!__DEV__) {
    webpackConfig.module.loaders.filter(loader =>
        loader.loaders && loader.loaders.find(name => /css/.test(name.split('?')[0]))
    ).forEach((loader) => {
        const first = loader.loaders[0];
        const rest = loader.loaders.slice(1);
        /* eslint-disable no-param-reassign */
        loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
        delete loader.loaders;
        /* eslint-enable no-param-reassign */
    });

    webpackConfig.plugins.push(
        new ExtractTextPlugin('css/[name].[contenthash].css', {
            allChunks: true,
        })
    );
}

module.exports = webpackConfig;
