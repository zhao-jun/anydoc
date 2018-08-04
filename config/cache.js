// http cache
const { cache } = require('../config/defaultConfig');

module.exports = (stats, req, res) => {
  const { expires, maxAge, cacheControl, lastModified, eTag } = cache;
  if (expires)
    res.setHeader(
      'Expires',
      new Date(Date.now() + maxAge * 1000).toUTCString()
    );
  if (cacheControl) res.setHeader('Cache-Control', `max-age=${maxAge}`);
  // 文件最后一次修改时间
  if (lastModified) res.setHeader('Last-Modified', stats.mtime.toUTCString());
  // 不重复标签即可，可以生成hash
  if (eTag) res.setHeader('ETag', `${stats.size}-${stats.mtime.valueOf()}`);
  const ifModifiedSince = req.headers['if-modified-since'];
  const ifNoneMatch = req.headers['if-none-match'];

  // 以前没缓存过
  if (!ifModifiedSince && !ifNoneMatch) return false;
  // 缓存并且未发生文件修改
  if (ifModifiedSince && ifModifiedSince !== res.getHeader('Last-Modified'))
    return false;
  if (ifNoneMatch && ifNoneMatch !== res.getHeader('ETag')) return false;

  return true;
};
