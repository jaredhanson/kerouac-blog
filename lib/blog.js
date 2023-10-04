var fs = require('fs')
  , path = require('path')
  , moment = require('moment-timezone')
  , FrontMatter = require('headmatter')
  , parseAuthor = require('parse-author')
  , merge = require('utils-merge');

var YYYYMMDD_REGEX = /^(\d{4})-(\d{2})-(\d{2})-(.*)/;
var MMDD_REGEX = /^(\d{2})-(\d{2})-(.*)/;
var DD_REGEX = /^(\d{2})-(.*)/;


function Blog(root, tz) {
  this._root = root || 'blog';
  this._tz = tz || 'Etc/UTC';
}

/**
 * Scans the file system for entries in the blog.  The `entries` argument passed
 * to the `callback` function will be an array of objects with the following
 * properties:
 *
 * - `slug`
 * - `publishedAt`
 * - `path`
 *
 * ```js
 * {
 *   slug: 'bananas',
 *   publishedAt: 2018-08-20T00:00:00.000Z,
 *   path: '2018-08-20-bananas.md'
 * }
 * ```
 *
 * The file system will be scanned for files in the blog's root directory.  Any
 * file containing front matter and having a name matching the following
 * patterns will be loaded as an entry:
 *
 *   - 'slug.markup'
 *   - 'YYYY-MM-DD-slug.markup'
 *   - 'YYYY/MM-DD-slug.markup'
 *   - 'YYYY/MM/DD-slug.markup'
 *
 * The 'YYYY-MM-DD-slug.markup' structure is preferred, and follows the
 * convention established by {@link https://jekyllrb.com Jeckyll} and its
 * support for {@link https://jekyllrb.com/docs/posts/ blogging}.  However,
 * nesting posts in year, month, and/or day subdirectories may be more
 * appropriate for blogs with a high frequency of posting.
 *
 * The entry's `publishedAt` property will be set based on the YYYY-MM-DD
 * pattern found in the corresponding file path.  If the entry's front matter
 * contains a `published` field, that value will take preference.
 *
 * @public
 * @param {Function} callback
 * @param {Error} callback.err
 * @param {Object[]} callback.entries
 */
Blog.prototype.entries = function(cb) {
  var self = this
    , root = this._root
    , tz = this._tz
    , entries = [];
  
  scan(root, [], function(err) {
    if (err) { return cb(err); }
    return cb(null, entries);
  })
  
  function scan(dir, pdirs, cb) {
    fs.readdir(dir, function(err, files) {
      if (err && err.code == 'ENOENT') {
        return cb();
      } else if (err) { return cb(err); }
    
    
      var i = 0
        , file, base, ext
        , entry;
    
      (function iter(err) {
        if (err) { return cb(err); }
      
        file = files[i++];
        if (!file) {
          pdirs.pop();
          return cb();
        }
      
        file = path.join(dir, file);
        ext = path.extname(file);
        base = path.basename(file, ext);
        entry = {};
        entry.path = path.relative(self._root, file)
      
        fs.stat(file, function(err, stat) {
          if (err) { return iter(err); }
          if (stat.isDirectory()) {
            pdirs.push(base);
            return scan(file, pdirs, iter);
          }
          if (!stat.isFile()) { return iter(); }
        
          entry.slug = base;
          entry.publishedAt = stat.birthtime;
        
          var match
            , date;
          if (pdirs.length == 0 && (match = YYYYMMDD_REGEX.exec(base))) {
            date = moment.tz([match[1],match[2],match[3]].join('-'), tz);
            entry.slug = match[4];
            entry.publishedAt = date.toDate();
          } else if (pdirs.length == 1 && (match = MMDD_REGEX.exec(base))) {
            date = moment.tz([pdirs[0],match[1],match[2]].join('-'), tz);
            entry.slug = match[3];
            entry.publishedAt = date.toDate();
          } else if (pdirs.length == 2 && (match = DD_REGEX.exec(base))) {
            date = moment.tz([pdirs[0],pdirs[1],match[1]].join('-'), tz);
            entry.slug = match[2];
            entry.publishedAt = date.toDate();
          }
        
          fs.readFile(file, 'utf8', function(err, text) {
            if (err) { return cb(err); }
        
            var doc;
            try {
              doc = FrontMatter.parse(text);
            } catch (ex) {
              return iter(new Error('Failed to parse front matter from file: ' + file));
            }
        
            var date = doc.head.published;
            if (date instanceof Date) {
              entry.publishedAt = date;
            } else if (typeof date == 'string') {
              date = moment.tz(date, tz);
              entry.publishedAt = date.toDate();
            }
          
            entries.push(entry);
            iter();
          });
        });
      })();
    }); // fs.readdir
  } // scan
}

Blog.prototype.entry = function(q, cb) {
  var self = this
    , root = this._root
    //, file = path.join(dir, q.file)
    , file = path.join(root, q.slug + '.md') // FIXME: make the markup format more generic
    , tz = this._tz;
    
    
    // TODO: Add a fast path here that loads based on q.path (for feed optimization)
    
  this.entries(function(err, entries) {
    var i, len
      , entry, ext, base;
    for (i = 0, len = entries.length; i < len; ++i) {
      entry = entries[i];
      if (q.slug == entry.slug) {
        return loadEntry(root, entry, tz, cb);
      }
    }
    return cb();
  });
}


function loadEntry(root, entry, tz, cb) {
  var p = entry.path;
  var ext = path.extname(p);
  
  var fpath = path.resolve(root, p);
  fs.readFile(fpath, 'utf8', function(err, text) {
    if (err) { return cb(err); }
    
    var doc, i, len;
    try {
      doc = FrontMatter.parse(text);
    } catch (ex) {
      return cb(new Error('Failed to parse front matter from file: ' + file));
    }
    
    doc.front = doc.head;
    delete doc.head;
    doc.format = ext.slice(1);
    
    doc.slug = entry.slug;
    doc.title = doc.front.title;
    
    // TODO: Support `permalink` in frontmatter, and return it as `doc.permanentURL`
    // https://jekyllrb.com/docs/front-matter/
    // https://jekyllrb.com/docs/permalinks/
    // This needs support in Kerouac core
    
    // Person constructs are expected to be in the form of:
    //   Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)
    //
    // This is the same form that npm accepts in [package.json](https://docs.npmjs.com/files/package.json).
    // It also is happens to be an "extended" form of originator fields
    // (`From:`, `Sender:`, etc) as defined by [RFC 2822](https://tools.ietf.org/html/rfc2822#section-3.6.2)
    // and used in email messages.  Such fields include the name and email
    // but omit the url, taking the form of:
    //   Barney Rubble <b@rubble.com>
    if (doc.front.author) {
      doc.author = parseAuthor(doc.front.author);
    }
    if (doc.front.contributors) {
      doc.contributors = [];
      for (i = 0, len = doc.front.contributors.length; i < len; ++i) {
        doc.contributors[i] = parseAuthor(doc.front.contributors[i]);
      }
    }
    
    doc.publishedAt = entry.publishedAt;
    if (doc.front.updated instanceof Date) {
      doc.updatedAt = doc.front.updated;
    } else if (typeof doc.front.updated == 'string') {
      doc.updatedAt = moment.tz(doc.front.updated, tz).toDate();
    }
    
    return cb(null, doc);
  });
}


module.exports = Blog;
