const http = require('http');
const path = require('path');
const defaultConfig = require('./config/defaultConfig');
const route = require('./route/index');
const chalk = require('chalk');

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
      route(req, res, filePath);
    });

    server.listen(port, hostname, () => {
      console.log(chalk.blue(`Server running at http://${hostname}:${port}/`));
    });
  }
}
// 不传参数可直接实例化后导出
module.exports = Server;
