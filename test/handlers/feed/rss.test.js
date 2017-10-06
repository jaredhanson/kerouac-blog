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
            { url: '/blog/hello/', post: true }
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
        '      <link>/blog/hello/</link>',
        '    </item>',
        '  </channel>',
        '</rss>',
        ''
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
  }); // with one post
  
});
