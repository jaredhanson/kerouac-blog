/**
 * Module dependencies.
 */
var fs = require('fs')
  , path = require('path')
  , kerouac = require('kerouac')
  , utils = require('./utils');

var DASHED_REGEX = /^(\d+)-(\d+)-(\d+)-(.*)/
  , UNDASHED_REGEX = /^(\d{4})(\d{2})(\d{2})-(.*)/


exports = module.exports = function(dir, pattern, options) {
  dir = dir || 'blog';
  
  /*
  if (typeof pattern == 'object') {
    options = pattern;
    pattern = undefined;
  }
  if (typeof dir == 'object') {
    options = dir;
    pattern = undefined;
    dir = undefined;
  }
  dir = dir || 'blog';
  pattern = pattern || '/blog/:year/:month/:day/:slug.html';
  options = options || {};
  
  
  var keys = [];
  var regexp = utils.pathRegexp(pattern
    , keys
    , options.sensitive
    , options.strict);
  */
  
  var site = kerouac();
  
  site.page('/:year/:month/:day/:slug.html', require('./handlers/post')(dir));
  site.page('/rss.xml', require('./handlers/feed/rss')());
  
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
        , file, ext
        , url;
      
      (function iter(err) {
        if (err) { return done(err); }
        
        file = files[idx++];
        if (!file) {
          //self.add('/rss.xml')
          //self.add('/sitemap.xml')
          
          return done();
        }
        
        file = path.join(dir, file);
        ext = path.extname(file);
        
        fs.stat(file, function(err, stats) {
          if (err) { return iter(err); }
          if (!stats.isFile()) { return iter(); }
          
          var year = stats.birthtime.getFullYear()
            , month = (stats.birthtime.getMonth() + 1)
            , day = stats.birthtime.getDate()
            , slug = path.basename(file, ext);
          
          month = (month < 10) ? ('0' + month) : month;
          day = (day < 10) ? ('0' + day) : day;
        
        
          var url = '/' + [ year, month, day, slug + '.html' ].join('/');
          self.add(url);
          iter();
        });
      })();
    });
    
    
    
    
   
  });
  
  return site;
  
  // FIXME: Port behind here.
  return function robots(site, pages) {
    var files = fs.readdirSync(dir);
    
    for (var i = 0, len = files.length; i < len; ++i) {
      var filename = files[i]
        , basename = path.basename(filename, path.extname(filename))
        , file = path.resolve(dir, filename)
        , params = {}
        , match
        , url;
        
      if (match = DASHED_REGEX.exec(basename)) {
        params.year = match[1];
        params.month = match[2];
        params.day = match[3];
        params.slug = match[4];
      } else if (match = UNDASHED_REGEX.exec(basename)) {
        params.year = match[1];
        params.month = match[2];
        params.day = match[3];
        params.slug = match[4];
      }
      
      url = utils.patternSubstitute(pattern, keys, params);
      
      // TODO: Make prettyURLs optional (possible passing it as an argument).
      site.page(url, kerouac.prettyURL()
                   , kerouac.url()
                   , kerouac.loadContent(file)
                   , middleware.mergeLocals(params, options.layout)
                   , middleware.init()
                   , kerouac.render());
                   
      
      // TODO: Use the non-substitutable portion of `pattern` to determine this.
      site.page('/blog/feed.rss', kerouac.url()
                                , middleware.rss2());
    }
  }
}
