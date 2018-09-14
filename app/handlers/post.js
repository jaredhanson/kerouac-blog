var kerouac = require('kerouac')
  , utils = require('../utils');


exports = module.exports = function(postsDB) {
  
  function loadPost(page, next) {
    var q = {
      slug: page.params.slug,
      year: page.params.year,
      month: page.params.month,
      day: page.params.day
    }
    
    postsDB.find(q, function(err, post) {
      page.locals.title = post.title;
      page.locals.createdAt = post.createdAt;
      page.locals.modifiedAt = post.modifiedAt;
      page.content = post.content;
      
      next();
    });
  }
  
  function meta(page, next) {
    page.locals.createdAt = page.createdAt;
    
    page.post = true;
    page.title = page.locals.title;
    page.tags = utils.tarray(page.locals.tags);
    next();
  }
  
  
  return [
    loadPost,
    meta,
    kerouac.render()
  ];
};

exports['@require'] = [
  'http://i.kerouacjs.org/blog/PostsDatabase'
];
