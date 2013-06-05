var builder = require('xmlbuilder');


module.exports = function(options) {
  options = options || {};
  
  return function(page, next) {
      
    var rss = builder.create('rss', { version: '1.0', encoding: 'UTF-8' });
    rss.a('version', '2.0');
    var chan = rss.e('channel')
    
    var xml = rss.end({ pretty: true });
    page.write(xml);
    page.end();
  }
}
