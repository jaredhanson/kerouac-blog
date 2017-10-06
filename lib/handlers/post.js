var fs = require('fs')
  , path = require('path')
  , kerouac = require('kerouac');


exports = module.exports = function(dir) {
  var exts = [ '.md' ];
  
  
  function findFile(page, next) {
    for (i = 0, len = exts.length; i < len; ++i) {
      ext = exts[i];
      
      file = path.resolve(dir, page.params.slug + ext);
      if (fs.existsSync(file)) {
        page.inputPath = file;
        return next();
      }
    }
    
    return next('FIXME: passed through, no blog content');
  }
  
  function meta(page, next) {
    page.post = true;
    page.title = page.locals.title;
    next();
  }
  
  
  return [
    findFile,
    kerouac.loadContent(),
    meta,
    kerouac.render()
  ];
};
