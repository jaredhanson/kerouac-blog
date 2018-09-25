/**
 * Atom 1.0 middleware.
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
  
  
  return function atomFeed(feed, next) {
    var site = feed.site
      , home, posts, post, entry, el, val, i, len, j, jlen;
    
    home = site.pages.filter(function(p) {
      return (p.meta && p.meta.home == true);
    });
    if (home.length) { home = home[0]; }
    else { home = undefined; }
    
    posts = site.pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts.
      return (p.meta && p.meta.post == true);
    });
    
    // TODO: sort posts by date
    
    
    var xml = builder.create('feed', { version: '1.0', encoding: 'UTF-8' });
    xml.a('xmlns', 'http://www.w3.org/2005/Atom')
    
    val = site.get('title');
    if (val) {
      xml.e('title', val);
    }
    val = site.get('description');
    if (val) {
      xml.e('subtitle', val);
    }
    // TODO: Feed updated attribute
    // TODO: id?
    
    if (home) {
      xml.e('link', { rel: 'alternate', type: 'text/html', href: linkto(home, feed) });
    }
    xml.e('link', { rel: 'self', type: 'application/atom+xml', href: linkto(feed, feed) });
    
    // TODO: Author
    // TODO: contributors
    // TODO: rights
    // TODO: generator
    // TODO: icon, logo (get from manifest?)
    
    
    (function iter(i, err) {
      if (err) { return next(err); }
      
      post = posts[i];
      if (!post) {
        xml = xml.end({ pretty: true });
        feed.write(xml);
        feed.end();
        return;
      } // done
    
      // TODO: summary
    
      entry = xml.e('entry');
      entry.e('id', post.locals.id || post.canonicalURL || post.url);
      if (post.locals.title) { entry.e('title', post.locals.title); }
      entry.e('link', { href: linkto(post, feed) });
      if (post.locals.publishedAt) { entry.e('published', post.locals.publishedAt.toISOString().substring(0,19)+'Z'); }
      if (post.locals.updatedAt) { entry.e('updated', post.locals.updatedAt.toISOString().substring(0,19)+'Z'); }
      if (post.locals.author) {
        el = entry.e('author');
        if (post.locals.author.name) { el.e('name', post.locals.author.name); }
        if (post.locals.author.url) { el.e('uri', post.locals.author.url); }
        if (post.locals.author.email) { el.e('email', post.locals.author.email); }
      }
      if (post.locals.contributors) {
        for (j = 0, jlen = post.locals.contributors.length; j < jlen; j++) {
          el = entry.e('contributor');
          if (post.locals.contributors[j].name) { el.e('name', post.locals.contributors[j].name); }
          if (post.locals.contributors[j].url) { el.e('uri', post.locals.contributors[j].url); }
          if (post.locals.contributors[j].email) { el.e('email', post.locals.contributors[j].email); }
        }
      }
      
      // TODO: category
      // TODO: source
      
      site.render(post.content, { engine: 'md' }, function(err, html) {
        if (err) { return iter(i + 1, err); }
        entry.e('content', { type: 'html' }, html.trim())
        iter(i + 1);
      }, false);
    })(0);
  };
};

exports['@require'] = [];
