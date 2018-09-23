var chai = require('chai');
var kerouac = require('kerouac')
var factory = require('../../../app/handlers/feed/atom');


describe('handlers/feed/atom', function() {
  
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
            page.canonicalURL = 'http://www.example.com/blog/feed.atom';
            
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
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<feed xmlns=\"http://www.w3.org/2005/Atom\">',
          '  <link rel="self" type="application/atom+xml" href="http://www.example.com/blog/feed.atom"/>',
          '  <entry>',
          '    <id>http://www.example.com/blog/2003/12/13/hello-world/</id>',
          '    <title>Hello, World</title>',
          '    <link href=\"http://www.example.com/blog/2003/12/13/hello-world/\"/>',
          '    <published>2003-12-13T18:30:02Z</published>',
          '  </entry>',
          '</feed>',
          ''
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
    }); // with one post
  
    describe('with one post in a configured feed', function() {
      var site = kerouac();
      site.set('title', 'dive into mark');
      site.set('description', 'A lot of effort went into making this effortless');
      
      var page, err;

      before(function(done) {
        chai.kerouac.handler(factory())
          .page(function(page) {
            page.canonicalURL = 'http://www.example.com/blog/feed.atom';
            
            page.site = site;
            page.site.pages = [
              { url: '/',
                canonicalURL: 'http://www.example.com/blog/',
                meta: { home: true },
                locals: {
                }
              },
              { url: '/2003/12/13/hello-world/',
                canonicalURL: 'http://www.example.com/blog/2003/12/13/hello-world/',
                meta: { post: true },
                locals: {
                  id: 'tag:example.org,2003:3.2397',
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
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<feed xmlns=\"http://www.w3.org/2005/Atom\">',
          '  <title>dive into mark</title>',
          '  <subtitle>A lot of effort went into making this effortless</subtitle>',
          '  <link rel="alternate" type="text/html" href="http://www.example.com/blog/"/>',
          '  <link rel="self" type="application/atom+xml" href="http://www.example.com/blog/feed.atom"/>',
          '  <entry>',
          '    <id>tag:example.org,2003:3.2397</id>',
          '    <title>Hello, World</title>',
          '    <link href=\"http://www.example.com/blog/2003/12/13/hello-world/\"/>',
          '    <published>2003-12-13T18:30:02Z</published>',
          '  </entry>',
          '</feed>',
          ''
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
    }); // with one post in a configured feed
    
  }); // handler
  
});
