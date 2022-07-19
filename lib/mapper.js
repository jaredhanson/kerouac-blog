var events = require('events')
  , util = require('util');


function Mapper(book, download) {
  events.EventEmitter.call(this);
}

util.inherits(Mapper, events.EventEmitter);

Mapper.prototype.map = function() {
  console.log('MAPPING BLOG!');
  
  // https://plaintextproject.online/articles/2022/06/08/planner.html
  // https://plaintextproject.online/articles/2021/11/03/mataroa.html
  //. YYYY-MM-DD-slug.md
  
  this.end();
}


module.exports = Mapper;
