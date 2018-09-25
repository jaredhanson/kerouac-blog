var fs = require('fs')
  , path = require('path')
  , moment = require('moment-timezone')
  , fm = require('headmatter')
  , parseAuthor = require('parse-author')
  , merge = require('utils-merge');

var YYYYMMDD_REGEX = /^(\d{4})-(\d{2})-(\d{2})-(.*)/;
var MMDD_REGEX = /^(\d{2})-(\d{2})-(.*)/;
var DD_REGEX = /^(\d{2})-(.*)/;


function LocalPostsDatabase(dir, tz) {
  this._dir = dir || 'blog';
  this._tz = tz || 'Etc/UTC';
  this._exts = [ '.md' ];
}

LocalPostsDatabase.prototype.list = function(cb) {
  var self = this
    , dir = this._dir
    , tz = this._tz
    , recs = [];
  
  scan(dir, [], function(err) {
    if (err) { return cb(err); }
    return cb(null, recs);
  })
  
  function scan(dir, pdirs, cb) {
    fs.readdir(dir, function(err, files) {
      if (err && err.code == 'ENOENT') {
        return cb();
      } else if (err) { return cb(err); }
    
    
      var idx = 0
        , file, base, ext
        , rec;
    
      (function iter(err) {
        if (err) { return cb(err); }
      
        file = files[idx++];
        if (!file) {
          pdirs.pop();
          return cb();
        }
      
        file = path.join(dir, file);
        ext = path.extname(file);
        base = path.basename(file, ext);
        rec = {};
        rec.context = {
          file: path.relative(self._dir, file)
        };
      
        fs.stat(file, function(err, stats) {
          if (err) { return iter(err); }
          if (stats.isDirectory()) {
            pdirs.push(base);
            return scan(file, pdirs, iter);
          }
          if (!stats.isFile()) { return iter(); }
        
          rec.slug = base;
          rec.publishedAt = stats.birthtime;
        
          var match
            , date;
          if (pdirs.length == 0 && (match = YYYYMMDD_REGEX.exec(base))) {
            date = moment.tz([match[1],match[2],match[3]].join('-'), tz);
            rec.slug = match[4];
            rec.publishedAt = date.toDate();
          } else if (pdirs.length == 1 && (match = MMDD_REGEX.exec(base))) {
            date = moment.tz([pdirs[0],match[1],match[2]].join('-'), tz);
            rec.slug = match[3];
            rec.publishedAt = date.toDate();
          } else if (pdirs.length == 2 && (match = DD_REGEX.exec(base))) {
            date = moment.tz([pdirs[0],pdirs[1],match[1]].join('-'), tz);
            rec.slug = match[2];
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
          
            recs.push(rec);
            iter();
          });
        });
      })();
    }); // fs.readdir
  } // scan
}

LocalPostsDatabase.prototype.find = function(q, cb) {
  var self = this
    , dir = this._dir
    , file = path.join(dir, q.file)
    , tz = this._tz;
    
  found(file);
  
  function found(file) {
    fs.stat(file, function(err, stats) {
      if (err) { return cb(err); }
      
      var rec = {};
      //rec.createdAt = stats.birthtime;
      //rec.modifiedAt = stats.mtime;
      
      fs.readFile(file, 'utf8', function(err, str) {
        if (err) { return cb(err); }
        
        var data, i, len;
        try {
          data = fm.parse(str);
        } catch (ex) {
          return cb(new Error('Failed to parse front matter from file: ' + file));
        }
        
        // Person constructs are expected to be in the form of:
        //   Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)
        //
        // This is the same form that npm accepts in [package.json](https://docs.npmjs.com/files/package.json).
        // It also is happens to be an "extended" form of originator fields
        // (`From:`, `Sender:`, etc) as defined by [RFC 2822](https://tools.ietf.org/html/rfc2822#section-3.6.2)
        // and used in email messages.  Such fields include the name and email
        // but omit the url, taking the form of:
        //   Barney Rubble <b@rubble.com>
        if (data.head.author) {
          data.head.author = parseAuthor(data.head.author);
        }
        if (data.head.contributors) {
          for (i = 0, len = data.head.contributors.length; i < len; ++i) {
            data.head.contributors[i] = parseAuthor(data.head.contributors[i]);
          }
        }
        
        if (data.head.published instanceof Date) {
          data.head.publishedAt = data.head.published;
        } else if (typeof data.head.published == 'string') {
          data.head.publishedAt = moment.tz(data.head.published, tz).toDate();
        }
        delete data.head.published;
        if (data.head.updated instanceof Date) {
          data.head.updatedAt = data.head.updated;
        } else if (typeof data.head.updated == 'string') {
          data.head.updatedAt = moment.tz(data.head.updated, tz).toDate();
        }
        delete data.head.updated;
        
        merge(rec, data.head);
        rec.content = data.content;
        return cb(null, rec);
      });
    });
  }
}


module.exports = LocalPostsDatabase;
