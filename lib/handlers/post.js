var fs = require('fs')
  , path = require('path')
  , kerouac = require('kerouac')
  , utils = require('../utils');


exports = module.exports = function(dir) {
  var exts = [ '.md' ];
  
  
  function findFile(page, next) {
    var file, ext,
      , i, len;
    
    for (i = 0, len = exts.length; i < len; ++i) {
      ext = exts[i];
      file = path.resolve(dir, page.params.slug + ext);
      if (fs.existsSync(file)) {
        page.inputPath = file;
        return next();
      }
    }
    
    return next('route');
  }
  
  function meta(page, next) {
    page.post = true;
    page.title = page.locals.title;
    page.tags = utils.tarray(page.locals.tags);
    next();
  }
  
  
  return [
    findFile,
    kerouac.loadContent(),
    kerouac.timestamps(),
    meta,
    kerouac.render()
  ];
};
