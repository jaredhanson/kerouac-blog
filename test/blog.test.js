var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var Blog = require('../lib/blog');


describe('Blog', function() {
  
  it('should export constructor', function() {
    expect(Blog).to.be.a('function');
  });
  
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
  
    it('should yield entry', function(done) {
      var blog = new Blog('test/fixtures');
      
      blog.find({ slug: 'atom-extensive-example' }, function(err, entry) {
        console.log(entry);
        console.log(err)
        
        if (err) { return done(err); }
        
        console.log(entry);
        done();
      });
    }); // should yield entries named with YYYY-MM-DD-slug format in UTC timezone
  
  }); // #entry
  
  
  describe('#find', function() {
    var db = new Blog('test/fixtures');
    
    describe('a post containing metadata from the extensive, single-entry example in RFC 4287', function() {
      var post;
  
      before(function(done) {
        db.find({ slug: 'atom-extensive-example' }, function(err, p) {
          if (err) { return done(err); }
          post = p;
          return done();
        });
      });
      
      it('should yield post', function() {
        expect(post).to.deep.equal({
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
          publishedAt: new Date('2003-12-13T12:29:29.000Z'),
          updatedAt: new Date('2005-07-31T12:29:29.000Z'),
          content: '_Update: The Atom draft is finished._\n'
        });
      });
    }); // a post containing metadata from the extensive, single-entry example in RFC 4287
    
    describe('a post containing metadata from the sample in the RSS 2.0 Specification', function() {
      var post;
  
      before(function(done) {
        db.find({ slug: 'rss-sample' }, function(err, p) {
          if (err) { return done(err); }
          post = p;
          return done();
        });
      });
      
      it('should yield post', function() {
        expect(post).to.deep.equal({
          title: 'Star City',
          publishedAt: new Date('2003-06-03T09:39:21.000Z'),
          content: "How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russia's [Star City](http://howe.iki.rssi.ru/GCTC/gctc_e.htm).\n"
        });
      });
    }); // a post containing metadata from the sample in the RSS 2.0 Specification
    
  }); // #find
  
});
