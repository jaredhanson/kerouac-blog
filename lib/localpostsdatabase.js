var fs = require('fs')
  , path = require('path')
  , moment = require('moment-timezone')
  , fm = require('headmatter')
  , merge = require('utils-merge');

var ISO8601_DATE_REGEX = /^(\d+)-(\d+)-(\d+)-(.*)/;


function LocalPostsDatabase(dir, tz) {
  this._dir = dir || 'blog';
  this._tz = tz || 'Etc/UTC';
  //this._tz = tz || 'America/Los_Angeles';
  this._exts = [ '.md' ];
}

LocalPostsDatabase.prototype.list = function(cb) {
  var dir = this._dir
    , tz = this._tz;
  
  fs.readdir(dir, function(err, files) {
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
        
        item.slug = base;
        item.publishedAt = stats.birthtime;
        
        var match
          , date;
        if (match = ISO8601_DATE_REGEX.exec(base)) {
          date = moment.tz([match[1],match[2],match[3]].join('-'), tz);
          item.slug = match[4];
          item.publishedAt = date.toDate();
        }
        
        list.push(item);
        iter();
      });
    })();
    
  });
  
}

LocalPostsDatabase.prototype.find = function(q, cb) {
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
        
        data.head.publishedAt = data.head.published;
        delete data.head.published;
        
        merge(item, data.head);
        item.content = data.content;
        return cb(null, item);
      });
    });
  }
}


module.exports = LocalPostsDatabase;
