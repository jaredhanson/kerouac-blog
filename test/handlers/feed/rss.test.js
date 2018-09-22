var chai = require('chai');
var kerouac = require('kerouac')
var factory = require('../../../app/handlers/feed/rss');


describe('handlers/feed/rss', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    var site = kerouac();
  
    describe('with one post', function() {
      var page, err;

      before(function(done) {
        chai.kerouac.handler(factory())
          .page(function(page) {
            page.site = site;
            page.site.pages = [
              { url: '/blog/2017/09/03/hello/',
                fullURL: 'http://www.example.com/blog/2017/09/03/hello/',
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
  
      it('should write feed', function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<rss version=\"2.0\">',
          '  <channel>',
          '    <item>',
          '      <title>Hello, World</title>',
          '      <link>http://www.example.com/blog/2017/09/03/hello/</link>',
          '      <pubDate>Sun, 03 Sep 2017 17:30:15 GMT</pubDate>',
          '    </item>',
          '  </channel>',
          '</rss>',
          ''
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
    }); // with one post
    
  }); // handler
  
});
