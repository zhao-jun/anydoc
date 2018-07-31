const http = require('http');
const path = require('path');
const fs = require('fs');
const config = require('./config/defaultConfig');

const {root, port, hostname} = config;

const server = http.createServer((req, res) => {
  // 拼接文件路径
  const filePath = path.join(root, req.url);
  // 文件是否存在，这是异步，也可以使用同步的API
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // res.statusCode = 404;
      // res.setHeader('Content-Type', 'text/html; charset=utf-8');
      // utf-8中文乱码
      res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
      res.end(`${filePath}不存在`);
    } else if (stats.isFile()) {
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      fs.readFile(filePath, (err, data) => {
        res.end(data);
      });
    } else if (stats.isDirectory()) {
      fs.readdir(filePath, (err, files) => {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.end(files.join(','));
      });
    }
  });

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
