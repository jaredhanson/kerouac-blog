var uri = require('url')
  , builder = require('xmlbuilder');


exports = module.exports = function() {
  
  return function atom(page, next) {
    var site = page.site
      , sect = page.section || site
      , pages, post, entry, val, i, len;
    
    var url = site.get('base url');
    if (url) {
      url = uri.parse(url);
    }
    
    var feed = builder.create('feed', { version: '1.0', encoding: 'UTF-8' });
    feed.a('xmlns', 'http://www.w3.org/2005/Atom')
    
    val = sect.get('title') || site.get('title');
    if (val) {
      feed.e('title', val);
    }
    val = sect.get('description') || site.get('description');
    if (val) {
      feed.e('subtitle', val);
    }
    
    // TODO: Get the blog index and set as `link` element
    
    pages = page.pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts, as indicated
      // by the `post` property.  Further filter the set of pages to just those
      // within the same section of the site, in case there are multiple blogs.
      return p.post == true && p.section == page.section;
    });
    
    for (i = 0, len = pages.length; i < len; i++) {
      post = pages[i];
      if (url) { url.pathname = post.url; }
    
      entry = feed.e('entry');
      if (post.title) { entry.e('title', post.title); }
      if (post.url) { entry.e('link', { href: url ? uri.format(url) : post.url }); }
      if (post.createdAt) { entry.e('published', post.createdAt.toISOString().substring(0,19)+'Z'); }
    };
    
    var xml = feed.end({ pretty: true });
    page.write(xml);
    page.end();
  };
};
