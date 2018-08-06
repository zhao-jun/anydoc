// http range
module.exports = (fileSizes, req, res) => {
  const range = req.headers['range'];
  if (!range) return { code: 200 };
  // 组匹配
  const sizes = range.match(/bytes=(\d*)-(\d*)/);
  const end = sizes[2] - 1 || fileSizes - 1; // 不存在就取最长
  const start = +sizes[1] || 0; // 不存在就是从头开始，理论是都存在的
  // 无法获取相应文件范围
  if (start > end || start < 0 || end > fileSizes) return { code: 416 };
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSizes}`);
  res.setHeader('Content-Length', end - start);
  return {
    code: 206,
    start,
    end,
  };
};
