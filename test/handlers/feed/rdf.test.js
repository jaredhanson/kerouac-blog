var chai = require('chai');
var sinon = require('sinon');
var kerouac = require('kerouac')
var factory = require('../../../lib/handlers/feed/rdf');


describe('handlers/feed/rdf', function() {
  
  it('should write empty feed', function(done) {
    var blog = new Object();
    blog.entries = sinon.stub().yields(null, []);
    
    chai.kerouac.page(factory(blog))
      .request(function(page) {
        page.fullURL = 'http://example.org/feed.rdf';
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<rdf:RDF xmlns="http://purl.org/rss/1.0/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">',
          '  <channel rdf:about="http://example.org/feed.rdf"/>',
          '</rdf:RDF>',
          ''
        ].join("\n");
        
        expect(this.body).to.equal(expected);
        done();
      })
      .generate();
  });
  
  it('should write single entry feed', function(done) {
    var blog = new Object();
    blog.entries = sinon.stub().yields(null, [ {
      slug: 'hello-world',
    } ]);
    blog.entry = sinon.stub().yields(null, {
      slug: 'hello-world',
      title: 'Hello, World',
      content: 'Hello, world! How are you today?',
      format: 'md',
      publishedAt: new Date('2003-12-13T18:30:02Z')
    });
    
    chai.kerouac.page(factory(blog))
      .request(function(page) {
        page.fullURL = 'http://www.example.com/blog/feed.rdf';
        
        // TODO: clean this up and assert arguments
        page.compile = sinon.stub().yields(null, '<p>Hello, world! How are you today?</p>');
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<rdf:RDF xmlns="http://purl.org/rss/1.0/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">',
          '  <channel rdf:about="http://www.example.com/blog/feed.rdf">',
          '    <items>',
          '      <rdf:Seq>',
          '        <rdf:li resource="http://www.example.com/blog/2003/12/13/hello-world/"/>',
          '      </rdf:Seq>',
          '    </items>',
          '  </channel>',
          '  <item rdf:about="http://www.example.com/blog/2003/12/13/hello-world/">',
          '    <title>Hello, World</title>',
          '    <link>http://www.example.com/blog/2003/12/13/hello-world/</link>',
          '    <dc:date>2003-12-13T18:30:02Z</dc:date>',
          '  </item>',
          '</rdf:RDF>',
          ''
        ].join("\n");
      
        expect(this.body).to.equal(expected);
        done();
      })
      .generate();
  });
  
  // http://web.resource.org/rss/1.0/spec#s4.1
  it('should write feed matching the basic sample RSS 1.0 document in RSS 1.0 Specification', function(done) {
    var blog = new Object();
    blog.entries = sinon.stub().yields(null, [ {
      slug: 'xslt',
    } ]);
    blog.entry = sinon.stub().yields(null, {
      slug: 'xslt',
      title: 'Processing Inclusions with XSLT',
      permanentURL: 'http://xml.com/pub/2000/08/09/xslt/xslt.html'
    });
    
    chai.kerouac.page(factory(blog))
      .request(function(page) {
        page.app = new Object();
        page.app.get = sinon.stub();
        page.app.get.withArgs('title').returns('XML.com');
        page.app.get.withArgs('description').returns('XML.com features a rich mix of information and services for the XML community.');
        
        page.fullURL = 'http://www.xml.com/xml/news.rss';
        
        // TODO: clean this up and assert arguments
        page.compile = sinon.stub().yields(null, '<p>Hello, world! How are you today?</p>');
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<rdf:RDF xmlns="http://purl.org/rss/1.0/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">',
          '  <channel rdf:about="http://www.xml.com/xml/news.rss">',
          '    <title>XML.com</title>',
          '    <description>XML.com features a rich mix of information and services for the XML community.</description>',
          // TODO: put this back in
          //'    <link>http://xml.com/pub</link>',
          '    <items>',
          '      <rdf:Seq>',
          '        <rdf:li resource="http://xml.com/pub/2000/08/09/xslt/xslt.html"/>',
          '      </rdf:Seq>',
          '    </items>',
          '  </channel>',
          '  <item rdf:about="http://xml.com/pub/2000/08/09/xslt/xslt.html">',
          '    <title>Processing Inclusions with XSLT</title>',
          '    <link>http://xml.com/pub/2000/08/09/xslt/xslt.html</link>',
          '  </item>',
          '</rdf:RDF>',
          ''
        ].join("\n");
      
        expect(this.body).to.equal(expected);
        done();
      })
      .generate();
  });
  
  // https://web.resource.org/rss/1.0/spec#s7
  it('should write feed matching the RSS 1.0 document pulling in elements from various modules in RSS 1.0 Specification', function(done) {
    var blog = new Object();
    blog.entries = sinon.stub().yields(null, [ {
      slug: 'xslt',
    } ]);
    blog.entry = sinon.stub().yields(null, {
      slug: 'xslt',
      title: 'Processing Inclusions with XSLT',
      permanentURL: 'http://xml.com/pub/2000/08/09/xslt/xslt.html'
    });
    
    chai.kerouac.page(factory(blog))
      .request(function(page) {
        page.app = new Object();
        page.app.get = sinon.stub();
        page.app.get.withArgs('title').returns('Meerkat');
        page.app.get.withArgs('description').returns('Meerkat: An Open Wire Service');
        
        page.fullURL = 'http://meerkat.oreillynet.com/?_fl=rss1.0';
        
        // TODO: clean this up and assert arguments
        page.compile = sinon.stub().yields(null, '<p>Hello, world! How are you today?</p>');
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<rdf:RDF xmlns="http://purl.org/rss/1.0/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">',
          '  <channel rdf:about="http://meerkat.oreillynet.com/?_fl=rss1.0">',
          '    <title>Meerkat</title>',
          '    <description>Meerkat: An Open Wire Service</description>',
          // TODO:
          //'    <link>http://meerkat.oreillynet.com</link>',
          '    <items>',
          '      <rdf:Seq>',
          '        <rdf:li resource="http://xml.com/pub/2000/08/09/xslt/xslt.html"/>',
          '      </rdf:Seq>',
          '    </items>',
          '  </channel>',
          '  <item rdf:about="http://xml.com/pub/2000/08/09/xslt/xslt.html">',
          '    <title>Processing Inclusions with XSLT</title>',
          '    <link>http://xml.com/pub/2000/08/09/xslt/xslt.html</link>',
          '  </item>',
          '</rdf:RDF>',
          ''
        ].join("\n");
      
        expect(this.body).to.equal(expected);
        done();
      })
      .generate();
  });
  
  describe.skip('handler', function() {
    
    describe('generating a feed with document pulling in modules example from RSS 1.0 Specification', function() {
      // http://web.resource.org/rss/1.0/spec#s4.1
      
      var site = kerouac();
      site.set('title', 'Meerkat');
      site.set('description', 'Meerkat: An Open Wire Service');
      
      var page, err;

      before(function(done) {
        chai.kerouac.page(factory())
          .request(function(page) {
            page.canonicalURL = 'http://meerkat.oreillynet.com/?_fl=rss1.0';
            
            page.site = site;
            page.site.pages = [
              { url: '/',
                canonicalURL: 'http://meerkat.oreillynet.com',
                meta: { home: true },
                locals: {
                }
              },
              { url: '/2000/08/09/xslt/xslt.html',
                canonicalURL: 'http://xml.com/pub/2000/08/09/xslt/xslt.html',
                meta: { post: true },
                locals: {
                  title: 'Processing Inclusions with XSLT',
                }
              }
            ];
          })
          .finish(function() {
            page = this;
            done();
          })
          .generate();
      });
  
      it('should write feed', function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<rdf:RDF xmlns="http://purl.org/rss/1.0/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">',
          '  <channel rdf:about="http://meerkat.oreillynet.com/?_fl=rss1.0">',
          '    <title>Meerkat</title>',
          '    <description>Meerkat: An Open Wire Service</description>',
          '    <link>http://meerkat.oreillynet.com</link>',
          '    <items>',
          '      <rdf:Seq>',
          '        <rdf:li resource="http://xml.com/pub/2000/08/09/xslt/xslt.html"/>',
          '      </rdf:Seq>',
          '    </items>',
          '  </channel>',
          '  <item rdf:about="http://xml.com/pub/2000/08/09/xslt/xslt.html">',
          '    <title>Processing Inclusions with XSLT</title>',
          '    <link>http://xml.com/pub/2000/08/09/xslt/xslt.html</link>',
          '  </item>',
          '</rdf:RDF>',
          ''
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
    }); // generating a feed with document pulling in modules example from RSS 1.0 Specification
    
  }); // handler
  
});
