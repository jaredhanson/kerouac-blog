var uri = require('url')
  , builder = require('xmlbuilder');


exports = module.exports = function() {
  
  return function feed(page, next) {
    var site = page.site
      , sect = page.section || site
      , pages = page.pages
      , post, item, val, i, len;
    
    var url = site.get('base url');
    if (url) {
      url = uri.parse(url);
    }
    
    var rss = builder.create('rss', { version: '1.0', encoding: 'UTF-8' });
    rss.a('version', '2.0');
    var chan = rss.e('channel')
    
    val = sect.get('title') || site.get('title');
    if (val) {
      chan.e('title', val);
    }
    val = sect.get('description') || site.get('description');
    if (val) {
      chan.e('description', val);
    }
    
    // TODO: Get the blog index and set as `link` element
    
    pages = pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts, as indicated
      // by the `post` property.  Further filter the set of pages to just those
      // within the same section of the site, in case there are multiple blogs.
      return p.post == true && p.section == page.section;
    });
    
    for (i = 0, len = pages.length; i < len; i++) {
      post = pages[i];
      if (url) { url.pathname = post.url; }
    
      item = chan.e('item');
      if (post.title) { item.e('title', post.title); }
      if (post.url) { item.e('link', url ? uri.format(url) : post.url); }
      if (post.createdAt) { item.e('pubDate', post.createdAt.toUTCString()); }
    };
    
    var xml = rss.end({ pretty: true });
    page.write(xml);
    page.end();
  };
};
