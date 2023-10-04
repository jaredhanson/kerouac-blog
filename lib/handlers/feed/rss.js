var uri = require('url')
  , utils = require('../../../app/utils');

/**
 * Really Simple Syndication (RSS) 2.0 middleware.
 *
 * This middleware generates a feed in RSS 2.0 format, which can be used to
 * syndicate content to users and other websites.
 *
 * RSS has a somewhat storied [history](http://cyber.harvard.edu/rss/rssVersionHistory.html)
 * resulting in the acronym referring to two different variants (each with
 * multiple versions), that are not compatible.  This middleware implements the
 * variant that stands for Really Simple Syndication, as championed by [Dave Winer](http://scripting.com/)
 * and [UserLand Software](http://www.userland.com/).
 *
 * References:
 *   - [RSS 2.0 Specification](http://cyber.harvard.edu/rss/rss.html)
 *   - [RSS Advisory Board](http://www.rssboard.org/)
 *   - [RSS](https://en.wikipedia.org/wiki/RSS)
 *   - [RSS Specifications](http://www.rss-specifications.com/)
 *   - [History of web syndication technology](https://en.wikipedia.org/wiki/History_of_web_syndication_technology)
 *   - [The Rise and Demise of RSS](https://twobithistory.org/2018/09/16/the-rise-and-demise-of-rss.html)
 */
exports = module.exports = function(blog) {
  var builder = require('xmlbuilder')
    , linkto = require('../../../app/utils').linkto;
  
  // TODO: Implement support for Media RSS
  //   http://www.rssboard.org/media-rss
  //   https://en.wikipedia.org/wiki/Media_RSS
  
  return function rssFeed(page, next) {
    if (!page.fullURL) { return next(new Error('Unable to generate Atom feed, set \'base url\' setting and try again')); }
    
    var xml = builder.create('rss', { version: '1.0', encoding: 'UTF-8' })
      , c, v;
    xml.a('version', '2.0');
    c = xml.e('channel');
    
    v = page.app && page.app.get('title');
    if (v) {
      c.e('title', v);
    }
    v = page.app && page.app.get('description');
    if (v) {
      c.e('description', v);
    }
    // TODO: resolve relative to url, if not fullURL
    c.e('link', uri.resolve(page.fullURL, '.'));
    
    blog.entries(function(err, entries) {
      if (err) { return next(err); }
      
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
          
          var i = c.e('item')
            , el, j, jlen;
            
          // TODO: support id in front matter, in Blog class
          if (entry.id) {
            var purl = uri.parse(entry.id);
            purl.protocol && (purl.protocol == 'http:' || purl.protocol == 'https:')
              ? i.e('guid', entry.id)
              : i.e('guid', { isPermaLink: false }, entry.id);
          } else {
            i.e('guid', entry.permanentURL || uri.resolve(page.fullURL, utils.linkify(entry.slug, entry.publishedAt)));
          }
          if (entry.title) { i.e('title', entry.title); }
          i.e('link', entry.permanentURL || uri.resolve(page.fullURL, utils.linkify(entry.slug, entry.publishedAt)));
          if (entry.publishedAt) { i.e('pubDate', entry.publishedAt.toUTCString()); }
          if (entry.author) {
            if (entry.author.email) { i.e('author', entry.author.email); }
          }
          
          // TODO: category
          
          page.compile(entry.content, entry.format, null, function(err, html) {
            if (err) { return next(err); }
            i.e('description', html.trim());
            iter(i + 1);
          });
        });
      })(0);
    });
  };
};
