var fs = require('fs')
  , path = require('path')
  , kerouac = require('kerouac');


exports = module.exports = function(layout) {
  
  function initialize(page, next) {
    // TODO: only set home when there is no paginging param
    page.meta = {
      home: true
    }
    next();
  }
  
  function select(page, next) {
    var posts = page.site.pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts.
      return (p.meta && p.meta.post == true);
    });
    
    page.locals.posts = posts.map(function(p) {
      var locals = p.locals;
      return locals;
    });
    next();
  }
  
  
  function meta(page, next) {
    page.locals.content = 'TODO: blog index';
    next();
  }
  
  function prerender(page, next) {
    page.layout = 'blog/feed';
    next();
  }
  
  function render(page, next) {
      //var site = page.app;
  
      //site.convert(page.content, page.markup, function(err, out) {
        //page.locals.content = out;
        page.render();
      //});
    }
  
  return [
    initialize,
    select,
    meta,
    prerender,
    render
    //kerouac.render()
  ];
};
