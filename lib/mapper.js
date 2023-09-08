var events = require('events')
  , util = require('util');


function Mapper(blog) {
  events.EventEmitter.call(this);
  this._blog = blog;
}

util.inherits(Mapper, events.EventEmitter);

Mapper.prototype.map = function() {
  console.log('MAPPING BLOG!');
  
  // https://plaintextproject.online/articles/2022/06/08/planner.html
  // https://plaintextproject.online/articles/2021/11/03/mataroa.html
  //. YYYY-MM-DD-slug.md
  
  var self = this;
  
  this._blog.list(function(err, posts) {
    console.log(err);
    console.log(posts);
    
    if (err) {
      self.emit('error', err);
      self.end();
      return;
    }
    
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
      console.log(url);
      
      self.request(url);
      
      //self.add(url, el.context);
    }
    
    
    //if (err) { return done(err); }
    self.end();
  });
  
  
  
  
}


module.exports = Mapper;
