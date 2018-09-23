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
      , posts, post, entry, val, i, len;
    
    posts = site.pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts.
      return (p.meta && p.meta.post == true);
    });
    
    
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
    // TODO: Feed updated attribute
    // TODO: Author
    
    // TODO: Get the blog index and set as `link` element
    
    for (i = 0, len = posts.length; i < len; i++) {
      post = posts[i];
    
      // TODO: id
      // TODO: updated
      // TODO: summary
    
      entry = feed.e('entry');
      entry.e('id', post.locals.id || post.canonicalURL || post.url);
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
