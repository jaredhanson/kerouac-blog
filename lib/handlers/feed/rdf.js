var builder = require('xmlbuilder')
  , uri = require('url')
  , linkto = require('../../../app/utils').linkto
  , utils = require('../../../app/utils');

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
exports = module.exports = function(blog) {
  // TODO: Implement support for mod_enclosure
  //       https://foz.home.xs4all.nl/mod_enclosure.html
  
  return function rdfFeed(page, next) {
    if (!page.fullURL) { return next(new Error('Unable to generate RSS feed, set \'base url\' setting and try again')); }
    
    var xml = builder.create('rdf:RDF', { version: '1.0', encoding: 'UTF-8' })
      , c, s, v;
    xml = builder.create('rdf:RDF', { version: '1.0', encoding: 'UTF-8' });
    xml.a('xmlns', 'http://purl.org/rss/1.0/')
    xml.a('xmlns:rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    xml.a('xmlns:dc', 'http://purl.org/dc/elements/1.1/')
    c = xml.e('channel', { 'rdf:about': page.fullURL });
    
    v = page.app && page.app.get('title');
    if (v) {
      c.e('title', v);
    }
    v = page.app && page.app.get('description');
    if (v) {
      c.e('description', v);
    }
    // TODO: implement this
    //c.e('link', uri.resolve(page.fullURL, '.'));
    
    blog.entries(function(err, entries) {
      if (err) { return next(err); }
      
      var s;
      if (entries.length) {
        s = c.e('items').e('rdf:Seq');
      }
      
      (function iter(i) {
        var entry = entries[i];
        if (!entry) {
          xml = xml.end({ pretty: true });
          page.write(xml);
          page.end();
          return;
        } // done
        
        blog.entry(entry, function(err, entry) {
          if (err) { return next(err); }
          
          s.e('rdf:li', { resource: entry.permanentURL || uri.resolve(page.fullURL, utils.linkify(entry.slug, entry.publishedAt)) });
          
          var i = xml.e('item', { 'rdf:about': entry.permanentURL || uri.resolve(page.fullURL, utils.linkify(entry.slug, entry.publishedAt)) })
            , el, j, jlen;
          
          if (entry.title) { i.e('title', entry.title); }
          i.e('link', entry.permanentURL || uri.resolve(page.fullURL, utils.linkify(entry.slug, entry.publishedAt)));
          if (entry.publishedAt) { i.e('dc:date', entry.publishedAt.toISOString().substring(0,19)+'Z'); }
          
          page.compile(entry.content, entry.format, null, function(err, html) {
            if (err) { return next(err); }
            // TODO: text
            //i.e('description', html.trim());
            iter(i + 1);
          });
        });
      })(0);
    });
  };
};
