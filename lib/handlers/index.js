var fs = require('fs')
  , path = require('path')
  , kerouac = require('kerouac');


exports = module.exports = function(dir) {
  
  function meta(page, next) {
    page.index = true;
    page.locals.content = 'TODO: blog index';
    page.render();
  }
  
  
  return [
    meta,
    //kerouac.render()
  ];
};
