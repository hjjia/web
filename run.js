const path = require('path');
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2));
const pPath = argv.ppath;

if (!pPath) {
    throw new Error('请传入 ppath 参数');
}

const serverPath = path.join(__dirname, pPath, '/server/server.js');
console.log(serverPath);
const server = require(serverPath);
server.run();
