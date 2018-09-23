/**
 * RDF Site Summary (RSS) 1.0 middleware.
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
 *   - [History of web syndication technology](https://en.wikipedia.org/wiki/History_of_web_syndication_technology)
 *   - [The Rise and Demise of RSS](https://twobithistory.org/2018/09/16/the-rise-and-demise-of-rss.html)
 */
exports = module.exports = function() {
  var builder = require('xmlbuilder')
    , linkto = require('../../utils').linkto;
  
  
  // TODO: Implement support for mod_enclosure
  //       https://foz.home.xs4all.nl/mod_enclosure.html
  
  return function feed(page, next) {
    var site = page.site
      , pages, post, item, val, i, len;
    
    var rdf = builder.create('rdf:RDF', { version: '1.0', encoding: 'UTF-8' });
    rdf.a('xmlns', 'http://purl.org/rss/1.0/')
    rdf.a('xmlns:rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    rdf.a('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
    
    var chan = rdf.e('channel');
    
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
      return (p.meta && p.meta.post == true);
    });
    
    for (i = 0, len = pages.length; i < len; i++) {
      post = pages[i];
    
      item = rdf.e('item');
      if (post.locals.title) { item.e('title', post.locals.title); }
      item.e('link', linkto(post, page));
      if (post.locals.publishedAt) { item.e('dc:date', post.locals.publishedAt.toISOString().substring(0,19)+'Z'); }
    };
    
    var xml = rdf.end({ pretty: true });
    page.write(xml);
    page.end();
  };
};

exports['@require'] = [];
