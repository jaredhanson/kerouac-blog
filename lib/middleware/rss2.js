var builder = require('xmlbuilder');


module.exports = function(options) {
  options = options || {};
  
  return function(page, next) {
    var pages = page.pages;
    
    var posts = Object.keys(pages).map(function(path) {
        return pages[path];
      }).filter(function(page) {
        return page.post == true;
      });
    
      
    var rss = builder.create('rss', { version: '1.0', encoding: 'UTF-8' });
    rss.a('version', '2.0');
    var chan = rss.e('channel')
    
    var post;
    for (var i = 0, len = posts.length; i < len; i++) {
      post = posts[i];
      
      var item = chan.e('item');
      if (post.title) { item.e('title', post.title); }
      if (post.url) { item.e('link', post.url); }
    }
    
    var xml = rss.end({ pretty: true });
    page.write(xml);
    page.end();
  }
}
