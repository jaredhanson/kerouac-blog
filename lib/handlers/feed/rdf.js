var builder = require('xmlbuilder')
  , linkto = require('../../utils').linkto;


/**
 * RSS middleware.
 *
 * This middleware generates a feed in RSS 1.0 format, which can be used to
 * syndicate content to users and other websites.
 *
 * RSS has a somewhat storied [history](http://cyber.harvard.edu/rss/rssVersionHistory.html)
 * resulting in the acronym referring to two different variants (each with
 * multiple versions), that are not compatible.  This middleware implements the
 * variant that stands for RDF Site Summary, as championed by the [RSS-DEV](https://groups.yahoo.com/neo/groups/rss-dev/info)
 * Working Group.
 *
 * References:
 *   - [RDF Site Summary (RSS) 1.0](http://web.resource.org/rss/1.0/spec)
 *   - [RSS](https://en.wikipedia.org/wiki/RSS)
 *   - [RSS-DEV Working Group](https://en.wikipedia.org/wiki/RSS-DEV_Working_Group)
 *   - [RSS Specifications](http://www.rss-specifications.com/)
 */
exports = module.exports = function() {
  
  // https://foz.home.xs4all.nl/mod_enclosure.html
  
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
