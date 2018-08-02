const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const artTemplate = require('art-template');
const { root } = require('../config/defaultConfig');

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

// 模版在这编译，可以减少请求的时候编译的时间
const tplPath = path.join(__dirname, '../template/index.html');
// 读取为Buffer
const source = fs.readFileSync(tplPath);
const template = artTemplate.compile(source.toString());

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
      let dir = path.relative(root, filePath);
      let data = {
        // 相对位置要加'/'，避免网站访问相对路径
        dir: dir ? `/${dir}` : '',
        files,
      };
      // res.end(files.join(','));
      res.end(template(data));
    }
  } catch (error) {
    console.error(error);
    // res.statusCode = 404;
    // res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // utf-8中文乱码
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`${filePath}不存在`);
  }
};
