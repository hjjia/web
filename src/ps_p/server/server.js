const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config.js');
const config = require('../../../config');

const numGameConfig = config.login;
config.host = '192.168.150.128';

const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {disableHostCheck: true,
    // webpack-dev-server options
    publicPath: webpackConfig.output.publicPath,
    hot: false,
    historyApiFallback: true,
    compress: true,
    stats: {
        colors: true,
    },

    // webpack-dev-middleware options
    quiet: false,
    noInfo: true,
    lazy: false,
});

exports.run = function () {
    server.listen(numGameConfig.port, config.host, () => {
    // eslint-disable-next-line no-console
        console.log(`dev server  # ${__dirname} # start on http://${config.host}:${numGameConfig.port}`);
    });
}
