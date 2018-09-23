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
  
  function meta(page, next) {
    page.locals.content = 'TODO: blog index';
    next();
  }
  
  function prerender(page, next) {
    page.layout = 'blog/feed';
    next();
  }
  
  return [
    initialize,
    meta,
    prerender,
    kerouac.render()
  ];
};
