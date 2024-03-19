var kerouac = require('kerouac')
  , utils = require('../../app/utils');


exports = module.exports = function(postsDB) {
  
  function initialize(page, next) {
    page.isPost = true;
    next();
  }
  
  function loadPost(page, next) {
    var q = {
      slug: page.params.slug,
      year: page.params.year,
      month: page.params.month,
      day: page.params.day,
    }
    
    //console.log('FIND:');
    //console.log(q)
    
    postsDB.entry(q, function(err, post) {
      page.locals.title = post.title;
      page.locals.publishedAt = post.publishedAt;
      page.locals.modifiedAt = post.modifiedAt;
      page.content = post.content;
      page.format = post.format;
      
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
  
  function render(page, next) {
      //var site = page.app;
  
      page.compile(page.layout, page.content, page.format);
  
      // TODO: clean up below here
      return;
  
      //site.convert(page.content, page.markup, function(err, out) {
        //page.locals.content = out;
        page.render();
      //});
    }
  
  
  return [
    initialize,
    loadPost,
    //meta,
    prerender,
    //kerouac.render()
    render
  ];
};
