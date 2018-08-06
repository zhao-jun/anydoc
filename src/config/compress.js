// http 压缩 根据不同请求头来进行压缩
const { createGzip, createDeflate } = require('zlib');

module.exports = (req, res, rs) => {
  // 获取相应的请求头，做相应的处理
  // match多个 includes 单个
  const acceptEncoding = req.headers['accept-encoding'] || '';
  if (acceptEncoding.match(/\b(gzip)\b/)) {
    // 向server发送响应头，所以不用返回
    res.setHeader('Content-Encoding', 'gzip');
    return rs.pipe(createGzip());
  }
  if (acceptEncoding.match(/\b(deflate)\b/)) {
    res.setHeader('Content-Encoding', 'deflate');
    return rs.pipe(createDeflate());
  }
  return rs;
};
