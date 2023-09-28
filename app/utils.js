var uri = require('url');

exports.linkify = function(slug, publishedAt) {
  var date = publishedAt.toISOString();
  
  // TODO: respect time zone
  return [
    date.substring(0,4),
    date.substring(5,7),
    date.substring(8,10),
    slug, ''
  ].join('/');
}


exports.linkto = function(target, context) {
  return target.canonicalURL || target.fullURL || target.absoluteURL;
}


exports.qformat = function(path, url){
  if (url) { url.pathname = path; }
  return url ? uri.format(url) : path;
};

exports.tarray = function(tags) {
  if (typeof tags == 'string') { return tags.split(','); }
  return tags;
}