var builder = require('xmlbuilder')
  , uri = require('url')
  , linkto = require('../../../app/utils').linkto
  , utils = require('../../../app/utils')

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
exports = module.exports = function(blog) {
  
  return function atomFeed(page, next) {
    if (!page.fullURL) { return next(new Error('Unable to generate Atom feed, set \'base url\' setting and try again')); }
    
    var xml = builder.create('feed', { version: '1.0', encoding: 'UTF-8' })
      , v;
    xml.a('xmlns', 'http://www.w3.org/2005/Atom');
    
    v = page.app && page.app.get('title');
    if (v) {
      xml.e('title', v);
    }
    
    xml.e('link', { rel: 'self', type: 'application/atom+xml', href: page.fullURL });
    
    
    
    
    // TODO:
    /*
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
    */
  
    // TODO: Author
    // TODO: contributors
    // TODO: rights
    // TODO: generator
    // TODO: icon, logo (get from manifest?)
    
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
          
          // TODO: sort posts by date
          
          // TODO: summary
          
          var e = xml.e('entry')
            , el, j, jlen;
          e.e('id', entry.canonicalURL || entry.url);
          if (entry.title) { e.e('title', entry.title); }
          
          //entry.e('link', { href: linkto(post, feed) });
          
          e.e('link', { href: uri.resolve(page.fullURL, utils.linkify(entry.slug, entry.publishedAt)) });
          
          if (entry.publishedAt) { e.e('published', entry.publishedAt.toISOString().substring(0,19)+'Z'); }
          if (entry.updatedAt) { e.e('updated', entry.updatedAt.toISOString().substring(0,19)+'Z'); }
          if (entry.author) {
            el = e.e('author');
            if (entry.author.name) { el.e('name', entry.author.name); }
            if (entry.author.url) { el.e('uri', entry.author.url); }
            if (entry.author.email) { el.e('email', entry.author.email); }
          }
          if (entry.contributors) {
            for (j = 0, jlen = entry.contributors.length; j < jlen; j++) {
              el = e.e('contributor');
              if (entry.contributors[j].name) { el.e('name', entry.contributors[j].name); }
              if (entry.contributors[j].url) { el.e('uri', entry.contributors[j].url); }
              if (entry.contributors[j].email) { el.e('email', entry.contributors[j].email); }
            }
          }
          
      // TODO: category
      // TODO: source
          
          page.compile(entry.content, entry.format, null, function(err, html) {
            if (err) { return next(err); }
            e.e('content', { type: 'html' }, html.trim())
            iter(i + 1);
          });
        });
      })(0);
    });
  };
};

