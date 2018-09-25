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
  
    describe('with one post', function() {
      var site = kerouac();
      
      var page, err;

      before(function(done) {
        chai.kerouac.handler(factory())
          .page(function(page) {
            page.canonicalURL = 'http://www.example.com/blog/feed.rss';
            
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
          '<rss version=\"2.0\">',
          '  <channel>',
          '    <item>',
          '      <guid isPermaLink="true">http://www.example.com/blog/2003/12/13/hello-world/</guid>',
          '      <title>Hello, World</title>',
          '      <link>http://www.example.com/blog/2003/12/13/hello-world/</link>',
          '      <pubDate>Sat, 13 Dec 2003 18:30:02 GMT</pubDate>',
          '    </item>',
          '  </channel>',
          '</rss>',
          ''
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
    }); // with one post
    
    describe('generating a feed with the sample from RSS 2.0 Specification', function() {
      // https://cyber.harvard.edu/rss/examples/rss2sample.xml
      
      var site = kerouac();
      site.set('title', 'Liftoff News');
      site.set('description', 'Liftoff to Space Exploration.');
      
      var page, err;

      before(function(done) {
        chai.kerouac.handler(factory())
          .page(function(page) {
            page.canonicalURL = 'http://www.example.com/blog/feed.rss';
            
            page.site = site;
            page.site.pages = [
              { url: '/',
                canonicalURL: 'http://liftoff.msfc.nasa.gov/',
                meta: { home: true },
                locals: {
                }
              },
              { url: '/news/2003/news-starcity.asp',
                canonicalURL: 'http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp',
                meta: { post: true },
                locals: {
                  id: 'http://liftoff.msfc.nasa.gov/2003/06/03.html#item573',
                  title: 'Star City',
                  publishedAt: new Date('2003-06-03T09:39:21.000Z'),
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
          '<rss version=\"2.0\">',
          '  <channel>',
          '    <title>Liftoff News</title>',
          '    <description>Liftoff to Space Exploration.</description>',
          '    <link>http://liftoff.msfc.nasa.gov/</link>',
          '    <item>',
          '      <guid isPermaLink="false">http://liftoff.msfc.nasa.gov/2003/06/03.html#item573</guid>',
          '      <title>Star City</title>',
          '      <link>http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp</link>',
          '      <pubDate>Tue, 03 Jun 2003 09:39:21 GMT</pubDate>',
          '    </item>',
          '  </channel>',
          '</rss>',
          ''
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
    }); // generating a feed with the sample from RSS 2.0 Specification
    
    describe('generating a equivalent to the extensive, single-entry example in RFC 4287', function() {
      // https://tools.ietf.org/html/rfc4287#section-1.1
      
      var site = kerouac();
      site.set('title', 'dive into mark');
      site.set('description', 'A lot of effort went into making this effortless');
      
      var page, err;

      before(function(done) {
        chai.kerouac.handler(factory())
          .page(function(page) {
            page.canonicalURL = 'http://example.org/feed.rss';
            
            page.site = site;
            page.site.pages = [
              { url: '/',
                canonicalURL: 'http://example.org/',
                meta: { home: true },
                locals: {
                }
              },
              { url: '/2005/04/02/atom',
                canonicalURL: 'http://example.org/2005/04/02/atom',
                meta: { post: true },
                locals: {
                  id: 'tag:example.org,2003:3.2397',
                  title: 'Atom draft-07 snapshot',
                  author: {
                    email: 'f8dy@example.com',
                    name: 'Mark Pilgrim',
                    url: 'http://example.org/'
                  },
                  contributors: [
                    { name: 'Sam Ruby' },
                    { name: 'Joe Gregorio' }
                  ],
                  publishedAt: new Date('2003-12-13T18:30:02Z'),
                  updatedAt: new Date('2005-07-31T12:29:29.000Z'),
                  content: 'Update: The Atom draft is finished.\n'
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
          '<rss version=\"2.0\">',
          '  <channel>',
          '    <title>dive into mark</title>',
          '    <description>A lot of effort went into making this effortless</description>',
          '    <link>http://example.org/</link>',
          '    <item>',
          '      <guid isPermaLink="false">tag:example.org,2003:3.2397</guid>',
          '      <title>Atom draft-07 snapshot</title>',
          '      <link>http://example.org/2005/04/02/atom</link>',
          '      <pubDate>Sat, 13 Dec 2003 18:30:02 GMT</pubDate>',
          '      <author>f8dy@example.com</author>',
          '    </item>',
          '  </channel>',
          '</rss>',
          ''
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
    }); // generating a equivalent to the extensive, single-entry example in RFC 4287
    
  }); // handler
  
});
