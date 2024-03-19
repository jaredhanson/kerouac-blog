// Module dependencies.
var builder = require('xmlbuilder')
  , uri = require('url')
  , utils = require('../../../app/utils');

/**
 * Atom 1.0 feed generator.
 *
 * This handler generates a feed in {@link https://en.wikipedia.org/wiki/Atom_(web_standard) Atom}
 * ({@link https://www.rfc-editor.org/rfc/rfc4287.html RFC 4287}) format.
 *
 * When writing Atom files to the file system, it is recommended that the file
 * extension `.atom` be used, in accordance with the {@link https://www.rfc-editor.org/rfc/rfc4287.html#section-7 media
 * type} registration.
 *
 * When a web server is configured for content negotiation, it is recommended
 * that the content type `application/atom+xml` be used, in accordance with the
 * {@link https://www.rfc-editor.org/rfc/rfc4287.html#section-7 media type} registration.
 *
 * @param {Blog} blog - A blog consisting of entries for which a feed will be generated.
 * @returns {kerouac.PageHandler}
 */
exports = module.exports = function(blog) {
  
  return function atomFeed(page, next) {
    // NOTE: This is needed to generate stable IDs for feed entries.
    if (!page.fullURL) { return next(new Error('Unable to generate Atom feed, set \'base url\' setting and try again')); }
    
    var xml = builder.create('feed', { version: '1.0', encoding: 'UTF-8' })
      , v;
    xml.a('xmlns', 'http://www.w3.org/2005/Atom');
    
    v = page.app && page.app.get('title');
    if (v) {
      xml.e('title', v);
    }
    v = page.app && page.app.get('description');
    if (v) {
      xml.e('subtitle', v);
    }
    // TODO: resolve relative to url, if not fullURL
    xml.e('link', { rel: 'alternate', type: 'text/html', href: uri.resolve(page.fullURL, '.') });
    xml.e('link', { rel: 'self', type: 'application/atom+xml', href: page.fullURL });
    
    
    // TODO: Feed updated attribute
    // TODO: id?
  
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
          if (entry.id) {
            e.e('id', entry.id);
          } else {
            e.e('id', uri.resolve(page.fullURL, utils.linkify(entry.slug, entry.publishedAt)));
          }
          if (entry.title) { e.e('title', entry.title); }
          e.e('link', { href: entry.permanentURL || uri.resolve(page.fullURL, utils.linkify(entry.slug, entry.publishedAt)) });
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
          
          page.convert(entry.content, entry.format, function(err, html) {
            if (err) { return next(err); }
            e.e('content', { type: 'html' }, html.trim());
            iter(i + 1);
          });
        });
      })(0);
    });
  };
};

