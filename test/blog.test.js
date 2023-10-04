var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var Blog = require('../lib/blog');


describe('Blog', function() {
  
  describe('#entries', function() {
    
    it('should yield entries named with YYYY-MM-DD-slug format in UTC timezone', function(done) {
      var blog = new Blog('test/fixtures/date');
      
      blog.entries(function(err, entries) {
        if (err) { return done(err); }
        
        expect(entries).to.deep.equal([ {
          slug: 'hello',
          publishedAt: new Date('2017-09-03T00:00:00.000Z'),
          path: '2017-09-03-hello.md'
        }, {
          slug: 'hello-again',
          publishedAt: new Date('2017-09-04T00:00:00.000Z'),
          path: '2017-09-04-hello-again.md'
        }, {
          slug: 'published',
          publishedAt: new Date('2018-04-26T20:09:27.000Z'),
          path: '2018-04-22-published.md'
        } ]);
        done();
      });
    }); // should yield entries named with YYYY-MM-DD-slug format in UTC timezone
    
    it('should yield entries named with YYYY-MM-DD-slug format in Los Angeles timezone', function(done) {
      var blog = new Blog('test/fixtures/date', 'America/Los_Angeles');
      
      blog.entries(function(err, entries) {
        if (err) { return done(err); }
        
        expect(entries).to.deep.equal([ {
          slug: 'hello',
          publishedAt: new Date('2017-09-03T07:00:00.000Z'),
          path: '2017-09-03-hello.md'
        }, {
          slug: 'hello-again',
          publishedAt: new Date('2017-09-04T07:00:00.000Z'),
          path: '2017-09-04-hello-again.md'
        }, {
          slug: 'published',
          publishedAt: new Date('2018-04-26T20:09:27.000Z'),
          path: '2018-04-22-published.md'
        } ]);
        done();
      });
    }); // should yield entries named with YYYY-MM-DD-slug format in Los Angeles timezone
    
    // TODO: clean this up
    it('should yield entries named with slug format in UTC timezone', function(done) {
      var blog = new Blog('test/fixtures/slug');
      
      blog.entries(function(err, entries) {
        if (err) { return done(err); }
        
        /*
        expect(entries).to.deep.equal([ {
          slug: 'hello',
          publishedAt: new Date('2017-09-03T00:00:00.000Z'),
          path: '2017-09-03-hello.md'
        }, {
          slug: 'hello-again',
          publishedAt: new Date('2017-09-04T00:00:00.000Z'),
          path: '2017-09-04-hello-again.md'
        }, {
          slug: 'published',
          publishedAt: new Date('2018-04-26T20:09:27.000Z'),
          path: '2018-04-22-published.md'
        } ]);
        */
        expect(entries[0].publishedAt).to.be.an.instanceof(Date);
        delete entries[0].publishedAt;
        expect(entries[0]).to.deep.equal({
          slug: 'hello',
          path: 'hello.md'
        });
        expect(entries[1]).to.deep.equal({
          slug: 'published-in-local',
          publishedAt: new Date('2018-09-23T13:09:27.000Z'),
          path: 'published-in-local.md'
        });
        expect(entries[2]).to.deep.equal({
          slug: 'published-in-nyc',
          publishedAt: new Date('2018-09-23T20:09:27.000Z'),
          path: 'published-in-nyc.md'
        });
        expect(entries[3]).to.deep.equal({
          slug: 'published-in-nz',
          publishedAt: new Date('2018-09-23T20:09:27.000Z'),
          path: 'published-in-nz.md'
        });
        expect(entries[4]).to.deep.equal({
          slug: 'published-in-sf',
          publishedAt: new Date('2018-09-23T20:09:27.000Z'),
          path: 'published-in-sf.md'
        });
        expect(entries[5]).to.deep.equal({
          slug: 'published-in-utc',
          publishedAt: new Date('2018-09-23T20:09:27.000Z'),
          path: 'published-in-utc.md'
        });
        done();
      });
    }); // should yield entries named with slug format in UTC timezone
    
    it('should yield entries named with slug format in Los Angeles timezone', function(done) {
      var blog = new Blog('test/fixtures/slug', 'America/Los_Angeles');
      
      blog.entries(function(err, entries) {
        if (err) { return done(err); }
        
        /*
        expect(entries).to.deep.equal([ {
          slug: 'hello',
          publishedAt: new Date('2017-09-03T00:00:00.000Z'),
          path: '2017-09-03-hello.md'
        }, {
          slug: 'hello-again',
          publishedAt: new Date('2017-09-04T00:00:00.000Z'),
          path: '2017-09-04-hello-again.md'
        }, {
          slug: 'published',
          publishedAt: new Date('2018-04-26T20:09:27.000Z'),
          path: '2018-04-22-published.md'
        } ]);
        */
        expect(entries[0].publishedAt).to.be.an.instanceof(Date);
        delete entries[0].publishedAt;
        expect(entries[0]).to.deep.equal({
          slug: 'hello',
          path: 'hello.md'
        });
        expect(entries[1]).to.deep.equal({
          slug: 'published-in-local',
          publishedAt: new Date('2018-09-23T20:09:27.000Z'),
          path: 'published-in-local.md'
        });
        expect(entries[2]).to.deep.equal({
          slug: 'published-in-nyc',
          publishedAt: new Date('2018-09-23T20:09:27.000Z'),
          path: 'published-in-nyc.md'
        });
        expect(entries[3]).to.deep.equal({
          slug: 'published-in-nz',
          publishedAt: new Date('2018-09-23T20:09:27.000Z'),
          path: 'published-in-nz.md'
        });
        expect(entries[4]).to.deep.equal({
          slug: 'published-in-sf',
          publishedAt: new Date('2018-09-23T20:09:27.000Z'),
          path: 'published-in-sf.md'
        });
        expect(entries[5]).to.deep.equal({
          slug: 'published-in-utc',
          publishedAt: new Date('2018-09-23T20:09:27.000Z'),
          path: 'published-in-utc.md'
        });
        done();
      });
    }); // should yield entries named with slug format in Los Angeles timezone
    
    it('should yield entries named with YYYY/MM-DD-slug format in UTC timezone', function(done) {
      var blog = new Blog('test/fixtures/year');
      
      blog.entries(function(err, entries) {
        if (err) { return done(err); }
        
        expect(entries).to.deep.equal([ {
          slug: 'hello',
          publishedAt: new Date('2017-09-03T00:00:00.000Z'),
          path: '2017/09-03-hello.md'
        }, {
          slug: 'hello-again',
          publishedAt: new Date('2017-09-04T00:00:00.000Z'),
          path: '2017/09-04-hello-again.md'
        }, {
          slug: 'published',
          publishedAt: new Date('2018-04-26T20:09:27.000Z'),
          path: '2018/04-22-published.md'
        } ]);
        done();
      });
    }); // should yield entries named with YYYY/MM-DD-slug format in UTC timezone
    
    it('should yield entries named with YYYY/MM/DD-slug format in UTC timezone', function(done) {
      var blog = new Blog('test/fixtures/year-month');
      
      blog.entries(function(err, entries) {
        if (err) { return done(err); }
        
        expect(entries).to.deep.equal([ {
          slug: 'hello',
          publishedAt: new Date('2017-09-03T00:00:00.000Z'),
          path: '2017/09/03-hello.md'
        }, {
          slug: 'hello-again',
          publishedAt: new Date('2017-10-04T00:00:00.000Z'),
          path: '2017/10/04-hello-again.md'
        }, {
          slug: 'published',
          publishedAt: new Date('2018-04-26T20:09:27.000Z'),
          path: '2018/04/22-published.md'
        } ]);
        done();
      });
    }); // should yield entries named with YYYY/MM/DD-slug format in UTC timezone
    
  }); // #entries
  
  describe('#entry', function() {
    
    it.skip('should yield entry named with YYYY-MM-DD-slug format', function(done) {
      var blog = new Blog('test/date');
      
      blog.entry({ year: '2017', month: '09', day: '04', slug: 'hello-again' }, function(err, entry) {
        if (err) { return done(err); }
        
        expect(entry).to.deep.equal({
          slug: 'hello-again',
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
          content: '_Update: The Atom draft is finished._\n',
          publishedAt: new Date('2003-12-13T12:29:29.000Z'),
          updatedAt: new Date('2005-07-31T12:29:29.000Z'),
        });
        done();
      });
    });
  
    // A more extensive, single-entry Atom feed document:
    // https://datatracker.ietf.org/doc/html/rfc4287#section-1.1
    it('should yield entry containing data from the more extensive, single-entry example in RFC 4287', function(done) {
      var blog = new Blog('test/fixtures/examples');
      
      blog.entry({ slug: 'atom-extensive-example' }, function(err, entry) {
        if (err) { return done(err); }
        
        expect(entry).to.deep.equal({
          slug: 'atom-extensive-example',
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
          front: {
            title: 'Atom draft-07 snapshot',
            author: 'Mark Pilgrim <f8dy@example.com> (http://example.org/)',
            contributors: [
              'Sam Ruby',
              'Joe Gregorio'
            ],
            published: new Date('2003-12-13T12:29:29.000Z'),
            updated: new Date('2005-07-31T12:29:29.000Z')
          },
          content: '_Update: The Atom draft is finished._\n',
          format: 'md',
          publishedAt: new Date('2003-12-13T12:29:29.000Z'),
          updatedAt: new Date('2005-07-31T12:29:29.000Z')
        });
        done();
      });
    }); // should yield entry containing data from the more extensive, single-entry example in RFC 4287
    
    // RSS 2.0-formatted sample file:
    // https://cyber.harvard.edu/rss/rss.html#sampleFiles
    // https://cyber.harvard.edu/rss/examples/rss2sample.xml
    it('should yield entry containing data from the RSS 2.0-formatted sample in RSS 2.0 specification', function(done) {
      var blog = new Blog('test/fixtures/examples');
      
      blog.entry({ slug: 'rss-sample' }, function(err, entry) {
        if (err) { return done(err); }
        
        expect(entry).to.deep.equal({
          slug: 'rss-sample',
          title: 'Star City',
          front: {
            title: 'Star City',
            published: 'Tue, 03 Jun 2003 09:39:21 GMT'
          },
          content: "How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia's [Star City](http://howe.iki.rssi.ru/GCTC/gctc_e.htm).\n",
          format: 'md',
          publishedAt: new Date('2003-06-03T09:39:21.000Z')
        });
        done();
      });
    }); // should yield entry containing data from the RSS 2.0-formatted sample in RSS 2.0 specification
  
  }); // #entry
  
});
