const path = require('path');

module.exports = {
  root: path.join(__dirname, '../'),    // process.cwd()避免node启动目录不同
  hostname : '127.0.0.1',
  port : 3000
};
