var fs = require('fs')
  , path = require('path')
  , fm = require('headmatter')
  , merge = require('utils-merge');

var DASHED_REGEX = /^(\d+)-(\d+)-(\d+)-(.*)/;


function LocalPostsDatabase() {
  this._dir = 'blog';
  this._exts = [ '.md' ];
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

LocalPostsDatabase.prototype.read = function(q, cb) {
  var dir = this._dir
    , exts = this._exts
    , file, ext
    , i, len;

  for (i = 0, len = exts.length; i < len; ++i) {
    ext = exts[i];
    file = path.resolve(dir, q.slug + ext);
    if (fs.existsSync(file)) {
      return found(file);
    }
  }
  
  function found(file) {
    fs.stat(file, function(err, stats) {
      if (err) { return cb(err); }
      
      var item = {};
      item.createdAt = stats.birthtime;
      item.modifiedAt = stats.mtime;
      
      fs.readFile(file, 'utf8', function(err, str) {
        if (err) { return cb(err); }
        
        var data;
        try {
          data = fm.parse(str);
        } catch (ex) {
          return cb(new Error('Failed to parse front matter from file: ' + file));
        }
        
        merge(item, data.head);
        item.content = data.content;
        return cb(null, item);
      });
    });
  }
}


module.exports = LocalPostsDatabase;
