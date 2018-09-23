var chai = require('chai');
var kerouac = require('kerouac')
var factory = require('../../../app/handlers/feed/rssjs');


describe('handlers/feed/rssjs', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    describe('with one post', function() {
      var site = kerouac();
      
      var page, err;

      before(function(done) {
        chai.kerouac.handler(factory())
          .page(function(page) {
            page.canonicalURL = 'http://www.example.com/blog/feed.rssjs';
          
            page.site = site;
            page.site.pages = [
              { url: '/2003/12/13/hello-world/',
                canonicalURL: 'http://www.example.com/blog/2003/12/13/hello-world/',
                meta: { post: true },
                locals: {
                  title: 'Hello, World',
                  publishedAt: new Date('2003-12-13T18:30:02Z'),
                }
              }
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
          '{',
          '  "rss": {',
          '    "version": "2.0",',
          '    "items": [',
          '      {',
          '        "guid": "http://www.example.com/blog/2003/12/13/hello-world/",',
          '        "title": "Hello, World",',
          '        "link": "http://www.example.com/blog/2003/12/13/hello-world/",',
          '        "pubDate": "Sat, 13 Dec 2003 18:30:02 GMT"',
          '      }',
          '    ]',
          '  }',
          '}'
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
    }); // with one post
    
  });
  
});
