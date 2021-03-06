var kerouac = require('kerouac')
  , utils = require('../utils');


exports = module.exports = function(postsDB) {
  
  function initialize(page, next) {
    page.meta = {
      post: true
    }
    next();
  }
  
  function loadPost(page, next) {
    var q = {
      slug: page.params.slug,
      year: page.params.year,
      month: page.params.month,
      day: page.params.day,
    }
    if (page.context) {
      q.file = page.context.file;
    }
    
    postsDB.find(q, function(err, post) {
      page.locals.title = post.title;
      page.locals.publishedAt = post.publishedAt;
      page.locals.modifiedAt = post.modifiedAt;
      page.content = post.content;
      
      next();
    });
  }
  
  function meta(page, next) {
    //page.locals.createdAt = page.createdAt;
    
    //page.post = true;
    //page.title = page.locals.title;
    //page.tags = utils.tarray(page.locals.tags);
    next();
  }
  
  function prerender(page, next) {
    page.layout = 'blog/post';
    
    // TODO: automatically set `locals.url` to the absolute URL of the page, prior to render
    // TODO: get exerpt, which should be the first paragraph (configurable)
    
    next();
  }
  
  
  return [
    initialize,
    loadPost,
    //meta,
    prerender,
    kerouac.render()
  ];
};

exports['@require'] = [
  'http://i.kerouacjs.org/blog/PostsDatabase'
];
