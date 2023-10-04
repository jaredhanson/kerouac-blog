var uri = require('url');

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
        
        iter(i + 1);
      })(0);
    });
    
    
    
    
    return;
    // TODO: Clean up below here
    
    var site = feed.site
      , home, posts, post
      , xml, chan, item, val, i, len;
    
    home = site.pages.filter(function(p) {
      return (p.meta && p.meta.home == true);
    });
    if (home.length) { home = home[0]; }
    else { home = undefined; }
    
    posts = site.pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts.
      return (p.meta && p.meta.post == true);
    });
    
    
    xml = builder.create('rss', { version: '1.0', encoding: 'UTF-8' });
    xml.a('version', '2.0');
    chan = xml.e('channel')
    
    val = site.get('title');
    if (val) {
      chan.e('title', val);
    }
    val = site.get('description');
    if (val) {
      chan.e('description', val);
    }
    
    if (home) {
      chan.e('link', linkto(home, feed));
    }
    
    // TODO: language
    // TODO: copyright
    // TODO: pubDate
    // TODO: lastBuildDate
    // TODO: category
    // TODO: generator
    // TODO: ttl
    // TODO: image
    
    
    (function iter(i, err) {
      if (err) { return next(err); }
      
      post = posts[i];
      if (!post) {
        xml = xml.end({ pretty: true });
        feed.write(xml);
        feed.end();
        return;
      } // done
    
      item = chan.e('item');
      if (post.locals.id) {
        item.e('guid', { isPermaLink: false }, post.locals.id);
      } else if (post.canonicalURL) {
        item.e('guid', { isPermaLink: true }, post.canonicalURL);
      } else {
        item.e('guid', { isPermaLink: false }, post.url);
      }
      if (post.locals.title) { item.e('title', post.locals.title); }
      item.e('link', linkto(post, feed));
      if (post.locals.publishedAt) { item.e('pubDate', post.locals.publishedAt.toUTCString()); }
      if (post.locals.author && post.locals.author.email) {
        item.e('author', post.locals.author.email);
      }
      
      // TODO: category
      
      //site.render(post.content, { engine: 'md' }, function(err, html) {
      site.convert(post.content, 'md', function(err, html) {
        if (err) { return iter(i + 1, err); }
        item.e('description', html.trim())
        iter(i + 1);
      }, false);
    })(0);
  };
};

exports['@require'] = [];
