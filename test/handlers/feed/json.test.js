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
    
    describe('with one post', function() {
      var site = kerouac();
      
      var page, err;

      before(function(done) {
        chai.kerouac.page(factory())
          .request(function(page) {
            page.canonicalURL = 'http://www.example.com/blog/feed.json';
          
            page.site = site;
            page.site.pages = [
              { url: '/2003/12/13/hello-world/',
                canonicalURL: 'http://www.example.com/blog/2003/12/13/hello-world/',
                meta: { post: true },
                locals: {
                  title: 'Hello, World',
                  publishedAt: new Date('2003-12-13T18:30:02Z'),
                },
                content: 'Hello, world! How are you today?'
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
          '{',
          '  "version": "https://jsonfeed.org/version/1",',
          '  "feed_url": "http://www.example.com/blog/feed.json",',
          '  "items": [',
          '    {',
          '      "id": "http://www.example.com/blog/2003/12/13/hello-world/",',
          '      "title": "Hello, World",',
          '      "url": "http://www.example.com/blog/2003/12/13/hello-world/",',
          '      "date_published": "2003-12-13T18:30:02Z",',
          '      "content_html": "<p>Hello, world! How are you today?</p>"',
          '    }',
          '  ]',
          '}'
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
    }); // with one post
    
    describe('generating a equivalent to the extensive, single-entry example in RFC 4287', function() {
      // https://tools.ietf.org/html/rfc4287#section-1.1
      
      var site = kerouac();
      site.set('title', 'dive into mark');
      site.set('description', 'A lot of effort went into making this effortless');
      
      var page, err;

      before(function(done) {
        chai.kerouac.page(factory())
          .request(function(page) {
            page.canonicalURL = 'http://example.org/feed.json';
            
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
                  updatedAt: new Date('2005-07-31T12:29:29.000Z')
                },
                content: '_Update: The Atom draft is finished._\n'
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
          '{',
          '  "version": "https://jsonfeed.org/version/1",',
          '  "title": "dive into mark",',
          '  "description": "A lot of effort went into making this effortless",',
          '  "home_page_url": "http://example.org/",',
          '  "feed_url": "http://example.org/feed.json",',
          '  "items": [',
          '    {',
          '      "id": "tag:example.org,2003:3.2397",',
          '      "title": "Atom draft-07 snapshot",',
          '      "url": "http://example.org/2005/04/02/atom",',
          '      "date_published": "2003-12-13T18:30:02Z",',
          '      "date_modified": "2005-07-31T12:29:29Z",',
          '      "content_html": "<p><em>Update: The Atom draft is finished.</em></p>"',
          '    }',
          '  ]',
          '}'
        ].join("\n");
      
        expect(page.body).to.equal(expected);
      });
    }); // generating a equivalent to the extensive, single-entry example in RFC 4287
    
  }); // handler
  
});
