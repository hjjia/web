/**
 * 新的 build 用文件
 * usage:
 * npm run build_new -- --config src/biz/web/crm/tag/webapck.config.js
 *
 * --pmap cs:kf
 * --pmap 为可选参数，只有打包后目录需要变更才使用
 */
const fs = require('fs-extra');
const originfs = require('fs');
const path = require('path');
const webpack = require('webpack');

process.env.NODE_ENV = 'production';

function compile(config) {
    return new Promise((resolve, reject) => {
        const compiler = webpack(config);

        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }

            const jsonStats = stats.toJson();

            if (jsonStats.errors.length > 0) {
                console.log(jsonStats.errors);
                return reject(new Error('Webpack compiler encounter error'));
            }

            return resolve(jsonStats);
        });
    });
}

const builder = () => {
    const argv = require('minimist')(process.argv.slice(2));
    const configPath = argv.config;
    const pmap = argv.pmap;

    if (!configPath) {
        throw new Error('请传入 --config 参数，具体查看 README.md');
    }

    const parsed = path.parse(configPath);
    console.log(parsed, 'path============================')
    let replacedPath = parsed.dir.replace('src', '');
    // let replacedPath = parsed.dir;
    if (pmap) {
        const pmapList = pmap.split(':');
        const first = pmapList[0];
        const second = pmapList[1];

        if (pmapList.length < 2 || !first || !second) {
            throw new Error('pmap 参数错误，usage: --pmap cs:kf');
        }

        replacedPath = replacedPath.replace(pmapList[0], pmapList[1]);
    }
    const staticDest = path.resolve(__dirname, `../resources/static/${replacedPath}`);
    console.log('url:', staticDest, configPath);

    const webpackConfig = require(path.resolve(configPath));

    compile(webpackConfig).then(() => {
        if (originfs.existsSync(staticDest)) {
            fs.removeSync(staticDest);
        }
        fs.mkdirpSync(staticDest);
        fs.copySync(webpackConfig.output.path, staticDest);
        fs.removeSync(webpackConfig.output.path);
    }).catch(err => {
        console.log(err);
        process.exit(1);
    });
};

builder();
