var uri = require('url');

exports.linkto = function(from, to) {
  return to.canonicalURL || to.fullURL || to.absoluteURL;
}


exports.qformat = function(path, url){
  if (url) { url.pathname = path; }
  return url ? uri.format(url) : path;
};

exports.tarray = function(tags) {
  if (typeof tags == 'string') { return tags.split(','); }
  return tags;
}