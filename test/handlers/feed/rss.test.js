var chai = require('chai');
var kerouac = require('kerouac')
var handler = require('../../../lib/handlers/feed/rss');


describe('handlers/feed/rss', function() {
  var site = kerouac();
  
  describe('with one post', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.handler(handler())
        .page(function(page) {
          page.site = site;
          page.pages = [
            { url: '/blog/2017/09/03/hello/',
              post: true,
              title: 'Hello, World',
              createdAt: new Date(Date.UTC(2017, 8, 3, 17, 30, 15)) }
          ];
        })
        .end(function(p) {
          page = p;
          done();
        })
        .dispatch();
    });
  
    it('should write sitemap.xml', function() {
      var expected = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version=\"2.0\">',
        '  <channel>',
        '    <item>',
        '      <title>Hello, World</title>',
        '      <link>/blog/2017/09/03/hello/</link>',
        '      <pubDate>Sun, 03 Sep 2017 17:30:15 GMT</pubDate>',
        '    </item>',
        '  </channel>',
        '</rss>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
  }); // with one post
  
});
