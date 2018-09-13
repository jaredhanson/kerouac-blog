var fs = require('fs')
  , path = require('path')
  , kerouac = require('kerouac')
  , utils = require('../utils');


exports = module.exports = function(postsDB) {
  var dir = 'blog'
    , layout;
  
  
  var exts = [ '.md' ];
  
  
  function loadPost(page, next) {
    var q = {
      slug: page.params.slug,
      year: page.params.year,
      month: page.params.month,
      day: page.params.day
    }
    
    postsDB.read(q, function(err, post) {
      page.locals.title = post.title;
      page.locals.createdAt = post.createdAt;
      page.locals.modifiedAt = post.modifiedAt;
      page.content = post.content;
      
      next();
    });
  }
  
  
  function findFile(page, next) {
    var file, ext
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
    page.locals.createdAt = page.createdAt;
    
    page.post = true;
    page.title = page.locals.title;
    page.tags = utils.tarray(page.locals.tags);
    next();
  }
  
  
  return [
    kerouac.manifest(),
    kerouac.canonicalURL(),
    loadPost,
    //findFile,
    //kerouac.timestamps(),
    kerouac.layout(layout),
    //kerouac.loadContent(),
    meta,
    kerouac.render()
  ];
};

exports['@require'] = [
  'http://i.kerouacjs.org/blog/PostsDatabase'
];
