var builder = require('xmlbuilder')
  , linkto = require('../../utils').linkto;


exports = module.exports = function() {
  
  return function feed(page, next) {
    var site = page.site
      , pages, post, item, val, i, len;
    
    var rss = builder.create('rdf:RDF', { version: '1.0', encoding: 'UTF-8' });
    rss.a('xmlns', 'http://purl.org/rss/1.0/')
    rss.a('xmlns:rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    rss.a('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
    
    var chan = rss.e('channel');
    
    val = site.get('title');
    if (val) {
      chan.e('title', val);
    }
    val = site.get('description');
    if (val) {
      chan.e('description', val);
    }
    
    // TODO: Get the blog index and set as `link` element
    
    pages = site.pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts, as indicated
      // by the `post` property.
      return p.post == true;
    });
    
    for (i = 0, len = pages.length; i < len; i++) {
      post = pages[i];
    
      item = rss.e('item');
      if (post.title) { item.e('title', post.title); }
      if (post.url) { item.e('link', linkto(page, post)); }
      if (post.createdAt) { item.e('dc:date', post.createdAt.toISOString().substring(0,19)+'Z'); }
    };
    
    var xml = rss.end({ pretty: true });
    page.write(xml);
    page.end();
  };
};
