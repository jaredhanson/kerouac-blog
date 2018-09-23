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
      , rec;
    
    (function iter(err) {
      if (err) { return cb(err); }
      
      file = files[idx++];
      if (!file) {
        return cb(null, list);
      }
      
      file = path.join(dir, file);
      ext = path.extname(file);
      base = path.basename(file, ext);
      rec = {};
      
      fs.stat(file, function(err, stats) {
        if (err) { return iter(err); }
        if (!stats.isFile()) { return iter(); }
        
        rec.slug = base;
        rec.publishedAt = stats.birthtime;
        
        var match
          , date;
        if (match = ISO8601_DATE_REGEX.exec(base)) {
          date = moment.tz([match[1],match[2],match[3]].join('-'), tz);
          rec.slug = match[4];
          rec.publishedAt = date.toDate();
        }
        
        fs.readFile(file, 'utf8', function(err, str) {
          if (err) { return cb(err); }
        
          var data;
          try {
            data = fm.parse(str);
          } catch (ex) {
            return iter(new Error('Failed to parse front matter from file: ' + file));
          }
        
          var date = data.head.published;
          if (date instanceof Date) {
            rec.publishedAt = date;
          } else if (typeof date == 'string') {
            date = moment.tz(date, tz);
            rec.publishedAt = date.toDate();
          }
          
          list.push(rec);
          iter();
        });
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
      
      var rec = {};
      rec.createdAt = stats.birthtime;
      rec.modifiedAt = stats.mtime;
      
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
        
        merge(rec, data.head);
        rec.content = data.content;
        return cb(null, rec);
      });
    });
  }
}


module.exports = LocalPostsDatabase;
