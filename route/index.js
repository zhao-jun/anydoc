const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const artTemplate = require('art-template');
const { root, compress: compressType } = require('../config/defaultConfig');
const mime = require('../config/mime');
const compress = require('./../config/compress');
const chalk = require('chalk');

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
      // 类型
      // res.statusCode = 200;
      // res.setHeader('Content-Type', `${mime(filePath)};  charset=utf-8`);
      let rs = fs.createReadStream(filePath);
      if (filePath.match(compressType)) {
        rs = compress(req, res, rs);
      }
      // 发送一个响应头给请求，只能被调用一次，setHeader必须在此之前调用
      res.writeHead(200, {
        'Content-Type': `${mime(filePath)};  charset=utf-8`,
      });
      rs.pipe(res);
      // 推荐用流的方式
      // fs.readFile(filePath, (err, data) => {
      //   res.end(data);
      // });
    } else if (stats.isDirectory()) {
      let files = await readdir(filePath);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      let dir = path.relative(root, filePath);
      let data = {
        // 相对位置要加'/'，避免网站访问相对路径
        dir: dir ? `/${dir}` : '',
        files: files.map(file => ({
          file,
          icon: mime(file), // 具体icon todo
        })),
      };
      // res.end(files.join(','));
      res.end(template(data));
    }
  } catch (error) {
    console.error(chalk.red(error));
    // res.statusCode = 404;
    // res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // utf-8中文乱码
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`${filePath}不存在`);
  }
};
