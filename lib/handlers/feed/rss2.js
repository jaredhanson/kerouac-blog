var builder = require('xmlbuilder');


exports = module.exports = function() {
  
  return function feed(page, next) {
    var rss = builder.create('rss', { version: '1.0', encoding: 'UTF-8' });
    rss.a('version', '2.0');
    var chan = rss.e('channel')
    
    var site = page.site
      , pages = page.pages
      , post, item, i, len;
    
    pages = pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts, as indicated
      // by the `post` property.  Further filter the set of pages to just those
      // within the same section of the site, in case there are multiple blogs.
      return p.post == true && p.section == page.section;
    });
    
    for (i = 0, len = pages.length; i < len; i++) {
      post = pages[i];
    
      item = chan.e('item');
      if (post.title) { item.e('title', post.title); }
      if (post.url) { item.e('link', post.url); }
    };
    
    var xml = rss.end({ pretty: true });
    page.write(xml);
    page.end();
  };
};
