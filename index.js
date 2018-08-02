const http = require('http');
const path = require('path');
const config = require('./config/defaultConfig');
const route = require('./route/index');
const chalk = require('chalk');

const { root, port, hostname } = config;

const server = http.createServer((req, res) => {
  // 拼接文件路径，并对中文文件名解码
  const filePath = path.join(root, decodeURIComponent(req.url));
  route(req, res, filePath);
});

server.listen(port, hostname, () => {
  console.log(chalk.blue(`Server running at http://${hostname}:${port}/`));
});
