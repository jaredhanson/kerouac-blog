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
  var builder = require('xmlbuilder')
    , linkto = require('../../../app/utils').linkto;
  
  
  return function atomFeed(page, next) {
    console.log('BUILD ATOM FEED!');
    
    //return;
    
    
    blog.entries(function(err, entries) {
      if (err) { return next(err); }
      
      var xml = builder.create('feed', { version: '1.0', encoding: 'UTF-8' });
      xml.a('xmlns', 'http://www.w3.org/2005/Atom');
    
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
          
          console.log(entry);
        
          var e = xml.e('entry')
            , el, j, jlen;
          e.e('id', entry.canonicalURL || entry.url);
          if (entry.title) { e.e('title', entry.title); }
          
          //entry.e('link', { href: linkto(post, feed) });
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
          
          page.compile(entry.content, entry.format, null, function(err, html) {
            if (err) { return next(err); }
            e.e('content', { type: 'html' }, html.trim())
            iter(i + 1);
          });
        });
      })(0);
    });
    
    
    //var site = feed.site
    //var home, posts, post
    //  , xml, entry, el, val, i, len, j, jlen;
    
    /*
    home = site.pages.filter(function(p) {
      return (p.meta && p.meta.home == true);
    });
    if (home.length) { home = home[0]; }
    else { home = undefined; }
    
    posts = site.pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts.
      return (p.meta && p.meta.post == true);
    });
    */
      
    // TODO: sort posts by date
    
    
    
    
    return;
    
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
      
      //site.render(post.content, { engine: 'md' }, function(err, html) {
      site.convert(post.content, 'md', function(err, html) {
        if (err) { return iter(i + 1, err); }
        entry.e('content', { type: 'html' }, html.trim())
        iter(i + 1);
      }, false);
    })(0);
  };
};

exports['@require'] = [];
