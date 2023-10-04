var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../lib/handlers/feed/rss');


describe('handlers/feed/rss', function() {
  
  it('should write empty feed', function(done) {
    var blog = new Object();
    blog.entries = sinon.stub().yields(null, []);
    
    chai.kerouac.page(factory(blog))
      .request(function(page) {
        page.fullURL = 'http://example.org/feed.rss';
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<rss version=\"2.0\">',
          '  <channel>',
          '    <link>http://example.org/</link>',
          '  </channel>',
          '</rss>',
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
        page.fullURL = 'http://www.example.com/blog/feed.rss';
        
        // TODO: clean this up and assert arguments
        page.compile = sinon.stub().yields(null, '<p>Hello, world! How are you today?</p>');
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<rss version=\"2.0\">',
          '  <channel>',
          '    <link>http://www.example.com/blog/</link>',
          '    <item>',
          '      <guid>http://www.example.com/blog/2003/12/13/hello-world/</guid>',
          '      <title>Hello, World</title>',
          '      <link>http://www.example.com/blog/2003/12/13/hello-world/</link>',
          '      <pubDate>Sat, 13 Dec 2003 18:30:02 GMT</pubDate>',
          '      <description>&lt;p&gt;Hello, world! How are you today?&lt;/p&gt;</description>',
          '    </item>',
          '  </channel>',
          '</rss>',
          ''
        ].join("\n");
      
        expect(this.body).to.equal(expected);
        done();
      })
      .generate();
  });
  
  // RSS 2.0-formatted sample file:
  // https://cyber.harvard.edu/rss/rss.html#sampleFiles
  // https://cyber.harvard.edu/rss/examples/rss2sample.xml
  it('should write feed matching the RSS 2.0-formatted sample in RSS 2.0 specification', function(done) {
    var blog = new Object();
    blog.entries = sinon.stub().yields(null, [ {
      slug: 'news-starcity',
    } ]);
    blog.entry = sinon.stub().yields(null, {
      id: 'http://liftoff.msfc.nasa.gov/2003/06/03.html#item573',
      slug: 'news-starcity',
      title: 'Star City',
      publishedAt: new Date('2003-12-13T18:30:02Z'),
      permanentURL: 'http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp'
    });
    
    chai.kerouac.page(factory(blog))
      .request(function(page) {
        page.app = new Object();
        page.app.get = sinon.stub();
        page.app.get.withArgs('title').returns('Liftoff News');
        page.app.get.withArgs('description').returns('Liftoff to Space Exploration.');
        
        page.fullURL = 'http://liftoff.msfc.nasa.gov/feed.rss';
      
        // TODO: clean this up and assert arguments
        page.compile = sinon.stub().yields(null, '<p>How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia&#39;s <a href="http://howe.iki.rssi.ru/GCTC/gctc_e.htm">Star City</a>.</p>');
      })
      .finish(function() {
        var expected = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<rss version=\"2.0\">',
          '  <channel>',
          '    <title>Liftoff News</title>',
          '    <description>Liftoff to Space Exploration.</description>',
          '    <link>http://liftoff.msfc.nasa.gov/</link>',
          '    <item>',
          '      <guid>http://liftoff.msfc.nasa.gov/2003/06/03.html#item573</guid>',
          '      <title>Star City</title>',
          '      <link>http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp</link>',
          '      <pubDate>Sat, 13 Dec 2003 18:30:02 GMT</pubDate>',
          '      <description>&lt;p&gt;How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia&amp;#39;s &lt;a href=&quot;http://howe.iki.rssi.ru/GCTC/gctc_e.htm&quot;&gt;Star City&lt;/a&gt;.&lt;/p&gt;</description>',
          '    </item>',
          '  </channel>',
          '</rss>',
          ''
        ].join("\n");
    
        expect(this.body).to.equal(expected);
        done();
      })
      .generate();
  }); // should write feed matching the RSS 2.0-formatted sample in RSS 2.0 specification
  
  it('should write feed equivalent to the more extensive, single-entry example in RFC 4287', function(done) {
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
          '      <description>&lt;p&gt;&lt;em&gt;Update: The Atom draft is finished.&lt;/em&gt;&lt;/p&gt;</description>',
          '    </item>',
          '  </channel>',
          '</rss>',
          ''
        ].join("\n");
        
        expect(this.body).to.equal(expected);
        done();
      })
      .generate();
  }); // should write feed equivalent to the more extensive, single-entry example in RFC 4287
  
});
