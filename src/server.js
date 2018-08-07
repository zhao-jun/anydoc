const http = require('http');
const path = require('path');
const chalk = require('chalk');
const defaultConfig = require('./config/defaultConfig');
const openUrl = require('./config/openUrl');
const route = require('./route/index');

class Server {
  constructor(config) {
    this.config = Object.assign({}, defaultConfig, config);
    // this.start();
  }

  start() {
    const { root, port, hostname } = this.config;
    const server = http.createServer((req, res) => {
      // 拼接文件路径，并对中文文件名解码
      const filePath = path.join(root, decodeURIComponent(req.url));
      route(req, res, filePath, this.config);
    });

    server.listen(port, hostname, () => {
      const addr = `http://${hostname}:${port}/`;
      console.log(chalk.blue(`Server running at ${addr}`));
      openUrl(addr);
    });
  }
}
// 不传参数可直接实例化后导出
module.exports = Server;
