/**
 * RSS middleware.
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
exports = module.exports = function() {
  var builder = require('xmlbuilder')
    , linkto = require('../../utils').linkto;
  
  // TODO: Implement support for Media RSS
  //   http://www.rssboard.org/media-rss
  //   https://en.wikipedia.org/wiki/Media_RSS
  
  return function rssFeed(page, next) {
    var site = page.site
      , posts, post, item, val, i, len;
    
    var rss = builder.create('rss', { version: '1.0', encoding: 'UTF-8' });
    rss.a('version', '2.0');
    
    var chan = rss.e('channel')
    
    val = site.get('title');
    if (val) {
      chan.e('title', val);
    }
    val = site.get('description');
    if (val) {
      chan.e('description', val);
    }
    
    posts = site.pages.filter(function(p) {
      return p.index == true;
    });
    if (posts.length) {
      chan.e('link', linkto(posts[0], page));
    }
    
    posts = site.pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts, as indicated
      // by the `post` property.
      return p.post == true;
    });
    
    for (i = 0, len = posts.length; i < len; i++) {
      post = posts[i];
    
      item = chan.e('item');
      if (post.title) { item.e('title', post.title); }
      if (post.url) { item.e('link', linkto(post, page)); }
      if (post.createdAt) { item.e('pubDate', post.createdAt.toUTCString()); }
    };
    
    var xml = rss.end({ pretty: true });
    page.write(xml);
    page.end();
  };
};

exports['@require'] = [];
