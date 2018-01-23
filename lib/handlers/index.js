var fs = require('fs')
  , path = require('path')
  , kerouac = require('kerouac');


exports = module.exports = function(layout) {
  
  function meta(page, next) {
    page.index = true;
    page.locals.content = 'TODO: blog index';
    page.render();
  }
  
  
  return [
    kerouac.manifest(),
    kerouac.canonicalURL(),
    kerouac.layout(layout),
    meta,
    //kerouac.render()
  ];
};
