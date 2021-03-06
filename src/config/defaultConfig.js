module.exports = {
  root: process.cwd(), // process.cwd()会随node启动目录不同，path.join(__dirname, '../')文件夹目录
  hostname: '127.0.0.1',
  port: 3030,
  compress: /\.(html|css|js|md)\b/,
  cache: {
    // 和缓存相关的响应头
    expires: true,
    maxAge: 600, // s
    cacheControl: true,
    lastModified: true,
    eTag: true,
  },
};
