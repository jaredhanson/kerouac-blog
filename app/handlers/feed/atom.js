/**
 * Atom middleware.
 *
 * This middleware generates a feed in Atom format, which can be used to
 * syndicate content to users and other websites.
 *
 * Atom is an alternative to RSS, and while it is functionally equivalent,
 * was developed within the IETF and, as such, was specified by an industry
 * standards organization under a formal, vendor-neutral process.
 *
 * References:
 *   - [The Atom Syndication Format](https://tools.ietf.org/html/rfc4287)
 *   - [Atom (standard)](https://en.wikipedia.org/wiki/Atom_(standard))
 */
exports = module.exports = function() {
  var builder = require('xmlbuilder')
    , linkto = require('../../utils').linkto;
  
  
  return function atomFeed(res, next) {
    var site = res.site
      , pages, post, entry, val, i, len;
    
    var feed = builder.create('feed', { version: '1.0', encoding: 'UTF-8' });
    feed.a('xmlns', 'http://www.w3.org/2005/Atom')
    
    val = site.get('title');
    if (val) {
      feed.e('title', val);
    }
    val = site.get('description');
    if (val) {
      feed.e('subtitle', val);
    }
    
    // TODO: Get the blog index and set as `link` element
    
    pages = site.pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts, as indicated
      // by the `post` property.
      return (p.meta && p.meta.post == true);
    });
    
    for (i = 0, len = pages.length; i < len; i++) {
      post = pages[i];
    
      entry = feed.e('entry');
      if (post.locals.title) { entry.e('title', post.locals.title); }
      entry.e('link', { href: linkto(post, res) });
      if (post.locals.publishedAt) { entry.e('published', post.locals.publishedAt.toISOString().substring(0,19)+'Z'); }
    };
    
    var xml = feed.end({ pretty: true });
    res.write(xml);
    res.end();
  };
};

exports['@require'] = [];
