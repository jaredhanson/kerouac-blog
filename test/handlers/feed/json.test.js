var chai = require('chai');
var kerouac = require('kerouac')
var factory = require('../../../app/handlers/feed/json');


describe('handlers/feed/json', function() {
  
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
            page.canonicalURL = 'http://www.example.com/blog/feed.json';
          
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
          '  "version": "https://jsonfeed.org/version/1",',
          '  "feed_url": "http://www.example.com/blog/feed.json",',
          '  "items": [',
          '    {',
          '      "id": "http://www.example.com/blog/2003/12/13/hello-world/",',
          '      "title": "Hello, World",',
          '      "url": "http://www.example.com/blog/2003/12/13/hello-world/",',
          '      "date_published": "2003-12-13T18:30:02Z"',
          '    }',
          '  ]',
          '}'
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
    }); // with one post
    
  }); // handler
  
});
