/**
 * Module dependencies.
 */
var kerouac = require('kerouac')
  , fs = require('fs')
  , path = require('path');

var DASHED_REGEX = /^(\d+)-(\d+)-(\d+)-(.*)/;


exports = module.exports = function(dir, options) {
  if (typeof dir == 'object') {
    options = dir;
    dir = options.dir;
  }
  dir = dir || 'blog';
  options = options || {};
  
  
  var site = kerouac();
  
  site.on('mount', function onmount(parent) {
    // inherit settings
    this.set('layout engine', parent.get('layout engine'));
    
    this.locals.pretty = parent.locals.pretty;
  });
  
  
  site.page('/:year/:month/:day/:slug.html', require('./handlers/post')(dir, options.layout));
  // FIXME: pretty URL isn't catching this
  site.page('/index.html', require('./handlers/index')(options.layout));
  
  // https://github.com/jshttp/mime-db
  // https://help.github.com/articles/mime-types-on-github-pages/
  site.page('/feed.atom', require('./handlers/feed/atom')());
  site.page('/feed.rss', require('./handlers/feed/rss')());
  site.page('/feed.rdf', require('./handlers/feed/rdf')());
  site.page('/feed.json', require('./handlers/feed/json')());
  
  // TODO: implement a news-specific sitemap:
  //       https://support.google.com/webmasters/answer/74288
  // include it as a separate sitemap-news.xml
  
  site.page('/sitemap.xml', require('kerouac-sitemap')());
  
  site.bind(function(done) {
    var self = this;
    
    fs.readdir(dir, function(err, files) {
      if (err && err.code == 'ENOENT') {
        return done();
      } else if (err) { return done(err); }
      
      var idx = 0
        , file, base, ext
        , url;
      
      (function iter(err) {
        if (err) { return done(err); }
        
        file = files[idx++];
        if (!file) {
          return done();
        }
        
        file = path.join(dir, file);
        ext = path.extname(file);
        base = path.basename(file, ext);
        
        fs.stat(file, function(err, stats) {
          if (err) { return iter(err); }
          if (!stats.isFile()) { return iter(); }
          
          var year = stats.birthtime.getUTCFullYear()
            , month = (stats.birthtime.getUTCMonth() + 1)
            , day = stats.birthtime.getUTCDate()
            , slug = base;
          month = (month < 10) ? ('0' + month) : month;
          day = (day < 10) ? ('0' + day) : day;
          
          var match;
          if (match = DASHED_REGEX.exec(base)) {
            year = match[1];
            month = match[2];
            day = match[3];
            slug = match[4];
          }
          
          var url = '/' + [ year, month, day, slug + '.html' ].join('/');
          self.add(url);
          iter();
        });
      })();
    });
  });
  
  return site;
}
