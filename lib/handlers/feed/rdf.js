var uri = require('url')
  , builder = require('xmlbuilder');


exports = module.exports = function() {
  
  return function feed(page, next) {
    var site = page.site
      , sect = page.section || site
      , pages, post, item, val, i, len;
    
    var url = site.get('base url');
    if (url) {
      url = uri.parse(url);
    }
    
    var rss = builder.create('rdf:RDF', { version: '1.0', encoding: 'UTF-8' });
    rss.a('xmlns', 'http://purl.org/rss/1.0/')
    rss.a('xmlns:rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    rss.a('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
    
    var chan = rss.e('channel');
    
    val = sect.get('title') || site.get('title');
    if (val) {
      chan.e('title', val);
    }
    val = sect.get('description') || site.get('description');
    if (val) {
      chan.e('description', val);
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
    
      item = rss.e('item');
      if (post.title) { item.e('title', post.title); }
      if (post.url) { item.e('link', url ? uri.format(url) : post.url); }
      if (post.createdAt) { item.e('dc:date', post.createdAt.toISOString().substring(0,19)+'Z'); }
    };
    
    var xml = rss.end({ pretty: true });
    page.write(xml);
    page.end();
  };
};
