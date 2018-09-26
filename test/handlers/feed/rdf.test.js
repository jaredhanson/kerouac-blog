var chai = require('chai');
var kerouac = require('kerouac')
var factory = require('../../../app/handlers/feed/rdf');


describe('handlers/feed/rdf', function() {
  
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
            page.canonicalURL = 'http://www.example.com/blog/feed.rdf';
            
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
          '<rdf:RDF xmlns="http://purl.org/rss/1.0/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">',
          '  <channel rdf:about="http://www.example.com/blog/feed.rdf"/>',
          '  <item rdf:about="http://www.example.com/blog/2003/12/13/hello-world/">',
          '    <title>Hello, World</title>',
          '    <link>http://www.example.com/blog/2003/12/13/hello-world/</link>',
          '    <dc:date>2003-12-13T18:30:02Z</dc:date>',
          '  </item>',
          '</rdf:RDF>',
          ''
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
    }); // with one post
    
    describe('generating a feed with the sample from RSS 1.0 Specification', function() {
      // http://web.resource.org/rss/1.0/spec#s4.1
      
      var site = kerouac();
      site.set('title', 'XML.com');
      site.set('description', 'XML.com features a rich mix of information and services for the XML community.');
      
      var page, err;

      before(function(done) {
        chai.kerouac.handler(factory())
          .page(function(page) {
            page.canonicalURL = 'http://www.xml.com/xml/news.rss';
            
            page.site = site;
            page.site.pages = [
              { url: '/',
                canonicalURL: 'http://xml.com/pub',
                meta: { home: true },
                locals: {
                }
              },
              { url: '/2000/08/09/xslt/xslt.html',
                canonicalURL: 'http://xml.com/pub/2000/08/09/xslt/xslt.html',
                meta: { post: true },
                locals: {
                  title: 'Processing Inclusions with XSLT',
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
          '<rdf:RDF xmlns="http://purl.org/rss/1.0/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">',
          '  <channel rdf:about="http://www.xml.com/xml/news.rss">',
          '    <title>XML.com</title>',
          '    <description>XML.com features a rich mix of information and services for the XML community.</description>',
          '    <link>http://xml.com/pub</link>',
          '  </channel>',
          '  <item rdf:about="http://xml.com/pub/2000/08/09/xslt/xslt.html">',
          '    <title>Processing Inclusions with XSLT</title>',
          '    <link>http://xml.com/pub/2000/08/09/xslt/xslt.html</link>',
          '    <dc:date>2003-12-13T18:30:02Z</dc:date>',
          '  </item>',
          '</rdf:RDF>',
          ''
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
    }); // generating a feed with the sample from RSS 1.0 Specification
    
  }); // handler
  
});
