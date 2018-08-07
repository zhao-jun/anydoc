const { exec, spawn } = require('child_process');

module.exports = url => {
  switch (process.platform) {
    case 'darwin':
      exec(`open ${url}`);
      break;
    case 'win32':
      exec(`start ${url}`);
      break;
    default:
      spawn('xdg-open', [url]); // 参考anywhere
  }
};
