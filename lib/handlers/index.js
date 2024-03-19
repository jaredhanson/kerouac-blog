var fs = require('fs')
  , path = require('path')
  , kerouac = require('kerouac')
  , utils = require('../../app/utils');


exports = module.exports = function(blog, layout) {
  
  function fetchEntries(page, next) {
    page.locals.entries = [];
    
    blog.entries(function(err, entries) {
      if (err) { return next(err); }
      
      (function iter(i) {
        var entry = entries[i];
        if (!entry) {
          return next();
        } // done
        
        blog.entry(entry, function(err, entry) {
          if (err) { return next(err); }
          
          page.convert(entry.content, entry.format, function(err, html) {
            if (err) { return next(err); }
            
            //entry.format = 'html';
            //console.log(entry.content)
            //console.log(entry.format);
            
            // TODO: use page.convert
            var txt = page.app.convert(entry.content, entry.format, 'txt', { excerpt: true });
            
            entry.content = html;
            entry.format = 'html'; // TODO: delete this property
            entry.excerpt = txt;
            entry.url = '/' + utils.linkify(entry.slug, entry.publishedAt);
            
            // TODO: summarize it
            page.locals.entries.push(entry);
            iter(i + 1);
            
            // TODO: remove code below here
            /*
            page.app.convert(entry.content, entry.format, 'txt', { excerpt: true }, function(err, txt) {
              if (err) { return next(err); }
              
              entry.content = html;
              entry.format = 'html'; // TODO: delete this property
              entry.excerpt = txt;
              entry.url = '/' + utils.linkify(entry.slug, entry.publishedAt);
              
              // TODO: summarize it
              page.locals.entries.push(entry);
              iter(i + 1);
            });
            */
          });
        });
      })(0);
    });
  }
  
  function prerender(page, next) {
    page.layout = page.layout || 'blog/index';
    next();
  }
  
  function render(page, next) {
    page.render(page.layout);
  }
  
  return [
    fetchEntries,
    prerender,
    render
  ];
};
