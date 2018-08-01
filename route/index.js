const fs = require('fs');
const promisify = require('util').promisify;

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

module.exports = async (req, res, filePath) => {
  // 文件是否存在，这是异步，也可以使用同步的API
  try {
    let stats = await stat(filePath);
    if (stats.isFile()) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      // 推荐用流的方式
      // fs.readFile(filePath, (err, data) => {
      //   res.end(data);
      // });
      fs.createReadStream(filePath).pipe(res);
    } else if (stats.isDirectory()) {
      let files = await readdir(filePath);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(files.join(','));
    }
  } catch (error) {
    // res.statusCode = 404;
    // res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // utf-8中文乱码
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`${filePath}不存在`);
  }
};

