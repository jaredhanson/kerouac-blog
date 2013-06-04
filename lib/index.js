/**
 * Module dependencies.
 */
var fs = require('fs')
  , path = require('path')
  , kerouac = require('kerouac');


exports = module.exports = function(dir, prefix) {
  dir = dir || 'blog';
  prefix = prefix || '/blog';
  
  return function robots(site, pages) {
    console.log('kerouac-blog plugin registered...');
    
    var adir = path.resolve(process.cwd(), dir);
    var files = fs.readdirSync(adir);
    
    for (var i = 0, len = files.length; i < len; ++i) {
      var filename = files[i]
        , file = path.resolve(adir, filename)
        , comps = filename.split('.')
        , url = path.join(prefix, comps[0]) + '.html';
        
      // TODO: parse date from filename
      console.log(url);
      console.log(file);
      
      // TODO: Make prettyURLs optional (possible passing it as an argument).
      site.page(url, kerouac.prettyURL()
                   , kerouac.url()
                   , kerouac.loadContent(file)
                   , kerouac.render());
    }
  }
}
