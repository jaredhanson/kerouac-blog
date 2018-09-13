var fs = require('fs')
  , path = require('path');

var DASHED_REGEX = /^(\d+)-(\d+)-(\d+)-(.*)/;


function LocalPostsDatabase() {
  this._dir = 'blog';
}

LocalPostsDatabase.prototype.list = function(cb) {
  console.log('LIST!');
  
  var dir = this._dir;
  
  fs.readdir(dir, function(err, files) {
    console.log(err);
    console.log(files);
    
    if (err && err.code == 'ENOENT') {
      return cb();
    } else if (err) { return cb(err); }
    
    
    var list = []
      , idx = 0
      , file, base, ext
      , item;
    
    (function iter(err) {
      if (err) { return cb(err); }
      
      file = files[idx++];
      if (!file) {
        return cb(null, list);
      }
      
      file = path.join(dir, file);
      ext = path.extname(file);
      base = path.basename(file, ext);
      item = {};
      
      fs.stat(file, function(err, stats) {
        if (err) { return iter(err); }
        if (!stats.isFile()) { return iter(); }
        
        item.id = file;
        item.slug = base;
        item.createdAt = stats.birthtime;
        
        
        /*
        var match;
        if (match = DASHED_REGEX.exec(base)) {
          year = match[1];
          month = match[2];
          day = match[3];
          slug = match[4];
        }
        */
        
        list.push(item);
        iter();
        
        
        
      });
      
    })();
    
  });
  
}


module.exports = LocalPostsDatabase;
