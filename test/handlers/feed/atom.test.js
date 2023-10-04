var chai = require('chai');
var sinon = require('sinon');
var kerouac = require('kerouac')
var factory = require('../../../lib/handlers/feed/atom');


describe('handlers/feed/atom', function() {
  
  it('should write empty feed', function(done) {
    var blog = new Object();
    blog.entries = sinon.stub().yields(null, []);
    
    chai.kerouac.page(factory(blog))
      .request(function(page) {
        page.fullURL = 'http://example.org/feed.atom';
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<feed xmlns="http://www.w3.org/2005/Atom">',
          '  <link rel="alternate" type="text/html" href="http://example.org/"/>',
          '  <link rel="self" type="application/atom+xml" href="http://example.org/feed.atom"/>',
          '</feed>',
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
        page.fullURL = 'http://www.example.com/blog/feed.atom';
        
        // TODO: clean this up and assert arguments
        page.compile = sinon.stub().yields(null, '<p>Hello, world! How are you today?</p>');
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<feed xmlns=\"http://www.w3.org/2005/Atom\">',
          '  <link rel="alternate" type="text/html" href="http://www.example.com/blog/"/>',
          '  <link rel="self" type="application/atom+xml" href="http://www.example.com/blog/feed.atom"/>',
          '  <entry>',
          '    <id>http://www.example.com/blog/2003/12/13/hello-world/</id>',
          '    <title>Hello, World</title>',
          '    <link href=\"http://www.example.com/blog/2003/12/13/hello-world/\"/>',
          '    <published>2003-12-13T18:30:02Z</published>',
          '    <content type="html">&lt;p&gt;Hello, world! How are you today?&lt;/p&gt;</content>',
          '  </entry>',
          '</feed>',
          ''
        ].join("\n");
      
        expect(this.body).to.equal(expected);
        done();
      })
      .generate();
  });
  
  // A more extensive, single-entry Atom feed document:
  // https://datatracker.ietf.org/doc/html/rfc4287#section-1.1
  it('should write feed matching the more extensive, single-entry example in RFC 4287', function(done) {
    var blog = new Object();
    blog.entries = sinon.stub().yields(null, [ {
      slug: 'atom',
    } ]);
    blog.entry = sinon.stub().yields(null, {
      id: 'tag:example.org,2003:3.2397',
      slug: 'atom',
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
      permanentURL: 'http://example.org/2005/04/02/atom'
    });
    
    chai.kerouac.page(factory(blog))
      .request(function(page) {
        page.app = new Object();
        page.app.get = sinon.stub();
        page.app.get.withArgs('title').returns('dive into mark');
        page.app.get.withArgs('description').returns('A lot of effort went into making this effortless');
        
        page.fullURL = 'http://example.org/feed.atom';
        
        // TODO: clean this up and assert arguments
        page.compile = sinon.stub().yields(null, '<p><em>Update: The Atom draft is finished.</em></p>');
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<feed xmlns=\"http://www.w3.org/2005/Atom\">',
          '  <title>dive into mark</title>',
          '  <subtitle>A lot of effort went into making this effortless</subtitle>',
          '  <link rel="alternate" type="text/html" href="http://example.org/"/>',
          '  <link rel="self" type="application/atom+xml" href="http://example.org/feed.atom"/>',
          '  <entry>',
          '    <id>tag:example.org,2003:3.2397</id>',
          '    <title>Atom draft-07 snapshot</title>',
          '    <link href="http://example.org/2005/04/02/atom"/>',
          '    <published>2003-12-13T18:30:02Z</published>',
          '    <updated>2005-07-31T12:29:29Z</updated>',
          '    <author>',
          '      <name>Mark Pilgrim</name>',
          '      <uri>http://example.org/</uri>',
          '      <email>f8dy@example.com</email>',
          '    </author>',
          '    <contributor>',
          '      <name>Sam Ruby</name>',
          '    </contributor>',
          '    <contributor>',
          '      <name>Joe Gregorio</name>',
          '    </contributor>',
          '    <content type="html">&lt;p&gt;&lt;em&gt;Update: The Atom draft is finished.&lt;/em&gt;&lt;/p&gt;</content>',
          '  </entry>',
          '</feed>',
          ''
        ].join("\n");
      
        expect(this.body).to.equal(expected);
        done();
      })
      .generate();
  }); // should write feed with the more extensive, single-entry example in RFC 4287
  
});
