/**
 * Module dependencies.
 */
var kerouac = require('kerouac')
  , fs = require('fs')
  , path = require('path')
  , Mapper = require('./mapper')
  , FSBlog = require('./localpostsdatabase');

var DASHED_REGEX = /^(\d+)-(\d+)-(\d+)-(.*)/;


exports = module.exports = function(blog) {
  if (!blog || typeof blog == 'string') {
    blog = new FSBlog(blog || 'blog');
  }
  
  console.log('CREATING BLOG!');
  
  var router = new kerouac.Router();
  router.page('/:year/:month/:day/:slug.html', require('./handlers/post')(blog));
  
  
  return router;
  
  // TODO: clean up below here
  return;
  var dir, options;
  
  if (typeof dir == 'object') {
    options = dir;
    dir = options.dir;
  }
  dir = dir || 'blog';
  options = options || {};
  
  
  console.log('BLOG!');
  
  var site = kerouac();
  
  return site;
  
  
  // TODO: clean up below here
  
  site.on('mount', function onmount(parent) {
    // inherit settings
    this.set('layout engine', parent.get('layout engine'));
    
    this.locals.pretty = parent.locals.pretty;
  });
  
  
  // HTML pages
  site.page('/:year/:month/:day/:slug.html', postHandler);
  site.page('/index.html', feedHandler);
  // FIXME: pretty URL isn't catching this
  //site.page('/index.html', require('./handlers/index')(options.layout));
  
  // https://github.com/jshttp/mime-db
  // https://help.github.com/articles/mime-types-on-github-pages/
  // Feeds
  site.page('/feed.atom', atomFeed);
  site.page('/feed.rss', rssFeed);
  site.page('/feed.rdf', rdfFeed);
  site.page('/feed.json', jsonFeed);
  
  // TODO: implement a news-specific sitemap:
  //       https://support.google.com/webmasters/answer/74288
  // include it as a separate sitemap-news.xml
  
  site.page('/sitemap.xml', require('kerouac-sitemap')());
  
  site.bind(function(done) {
    var self = this;
    
    postsDB.list(function(err, posts) {
      if (err) { return done(err); }
      
      var el, i, len
        , url, year, month, day, slug;
      
      for (i = 0, len = posts.length; i < len; ++i) {
        el = posts[i];
        year = el.publishedAt.getUTCFullYear()
        month = (el.publishedAt.getUTCMonth() + 1)
        day = el.publishedAt.getUTCDate()
        slug = el.slug;
        
        month = (month < 10) ? ('0' + month) : month;
        day = (day < 10) ? ('0' + day) : day;
        
        // TODO: make sure these are in right timezone
        url = '/' + [ year, month, day, slug + '.html' ].join('/');
        self.add(url, el.context);
      }
      
      done();
    });
  });
  
  return site;
}

exports.createMapper = function(blog) {
  if (!blog || typeof blog == 'string') {
    blog = new FSBlog(blog || 'blog');
  }
  
  return new Mapper(blog);
};

exports.FSBlog = FSBlog;



exports['@implements'] = [
  'http://i.kerouacjs.org/Site',
  'http://i.kerouacjs.org/blog/Site'
];
exports['@require'] = [
  './handlers/feed',
  './handlers/post',
  './handlers/feed/atom',
  './handlers/feed/rss',
  './handlers/feed/rdf',
  './handlers/feed/json',
  'http://i.kerouacjs.org/blog/PostsDatabase'
];
