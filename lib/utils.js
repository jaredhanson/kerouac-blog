var uri = require('url');

exports.qformat = function(path, url){
  if (url) { url.pathname = path; }
  return url ? uri.format(url) : path;
};
