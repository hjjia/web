const config = {
    env: process.env.NODE_ENV || 'development',
    host: '127.0.0.1'
};

config.globals = {
    __DEV__: config.env === 'development',
    __PROD__: config.env === 'production',
    __TEST__: config.env === 'test',
}

config.numGame = {
    port: 8899
}

config.login = {
    port: 8989 
}
module.exports = config;
