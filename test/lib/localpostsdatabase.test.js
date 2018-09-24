var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var LocalPostsDatabase = require('../../lib/localpostsdatabase');


describe('LocalPostsDatabase', function() {
  
  it('should export constructor', function() {
    expect(LocalPostsDatabase).to.be.a('function');
  });
  
  describe('#find', function() {
    var db = new LocalPostsDatabase('test/fixtures');
    
    describe('a post containing metadata from the extensive, single-entry example in RFC 4287', function() {
      var post;
  
      before(function(done) {
        db.find({ file: 'atom-extensive.md' }, function(err, p) {
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
          content: 'Update: The Atom draft is finished.\n'
        });
      });
    }); // a post containing metadata from the extensive, single-entry example in RFC 4287
    
  }); // #find
  
  describe('with files named by slug', function() {
  
    describe('in UTC timezone', function() {
      var db = new LocalPostsDatabase('test/fixtures/slug');
  
      describe('#list', function() {
        var posts;
    
        before(function(done) {
          db.list(function(err, p) {
            if (err) { return done(err); }
            posts = p;
            return done();
          });
        });
    
        it('should queue pages', function() {
          expect(posts).to.have.length(6);

          expect(posts[0].publishedAt).to.be.an.instanceof(Date);
          delete posts[0].publishedAt;
          expect(posts[0]).to.deep.equal({
            slug: 'hello',
            context: { file: 'hello.md' }
          });
          expect(posts[1]).to.deep.equal({
            slug: 'published-in-local',
            publishedAt: new Date('2018-09-23T13:09:27.000Z'),
            context: { file: 'published-in-local.md' }
          });
          expect(posts[2]).to.deep.equal({
            slug: 'published-in-nyc',
            publishedAt: new Date('2018-09-23T20:09:27.000Z'),
            context: { file: 'published-in-nyc.md' }
          });
          expect(posts[3]).to.deep.equal({
            slug: 'published-in-nz',
            publishedAt: new Date('2018-09-23T20:09:27.000Z'),
            context: { file: 'published-in-nz.md' }
          });
          expect(posts[4]).to.deep.equal({
            slug: 'published-in-sf',
            publishedAt: new Date('2018-09-23T20:09:27.000Z'),
            context: { file: 'published-in-sf.md' }
          });
          expect(posts[5]).to.deep.equal({
            slug: 'published-in-utc',
            publishedAt: new Date('2018-09-23T20:09:27.000Z'),
            context: { file: 'published-in-utc.md' }
          });
        }); 
      }); // #list
  
    }); // in UTC timezone
    
    describe('in Los Angeles timezone', function() {
      var db = new LocalPostsDatabase('test/fixtures/slug', 'America/Los_Angeles');
  
      describe('#list', function() {
        var posts;
    
        before(function(done) {
          db.list(function(err, p) {
            if (err) { return done(err); }
            posts = p;
            return done();
          });
        });
    
        it('should queue pages', function() {
          expect(posts).to.have.length(6);

          expect(posts[0].publishedAt).to.be.an.instanceof(Date);
          delete posts[0].publishedAt;
          expect(posts[0]).to.deep.equal({
            slug: 'hello',
            context: { file: 'hello.md' }
          });
          expect(posts[1]).to.deep.equal({
            slug: 'published-in-local',
            publishedAt: new Date('2018-09-23T20:09:27.000Z'),
            context: { file: 'published-in-local.md' }
          });
          expect(posts[2]).to.deep.equal({
            slug: 'published-in-nyc',
            publishedAt: new Date('2018-09-23T20:09:27.000Z'),
            context: { file: 'published-in-nyc.md' }
          });
          expect(posts[3]).to.deep.equal({
            slug: 'published-in-nz',
            publishedAt: new Date('2018-09-23T20:09:27.000Z'),
            context: { file: 'published-in-nz.md' }
          });
          expect(posts[4]).to.deep.equal({
            slug: 'published-in-sf',
            publishedAt: new Date('2018-09-23T20:09:27.000Z'),
            context: { file: 'published-in-sf.md' }
          });
          expect(posts[5]).to.deep.equal({
            slug: 'published-in-utc',
            publishedAt: new Date('2018-09-23T20:09:27.000Z'),
            context: { file: 'published-in-utc.md' }
          });
        }); 
      }); // #list
  
    }); // in Los Angeles timezone
  
  }); // with files named by slug
  
  describe('with files named by date and slug', function() {
    
    describe('in UTC timezone', function() {
      var db = new LocalPostsDatabase('test/fixtures/date');
  
      describe('#list', function() {
        var posts;
    
        before(function(done) {
          db.list(function(err, p) {
            if (err) { return done(err); }
            posts = p;
            return done();
          });
        });
    
        it('should queue pages', function() {
          expect(posts).to.have.length(3);
          expect(posts[0]).to.deep.equal({
            slug: 'hello',
            publishedAt: new Date('2017-09-03T00:00:00.000Z'),
            context: { file: '2017-09-03-hello.md' }
          });
          expect(posts[1]).to.deep.equal({
            slug: 'hello-again',
            publishedAt: new Date('2017-09-04T00:00:00.000Z'),
            context: { file: '2017-09-04-hello-again.md' }
          });
          expect(posts[2]).to.deep.equal({
            slug: 'published',
            publishedAt: new Date('2018-04-26T20:09:27.000Z'),
            context: { file: '2018-04-22-published.md' }
          });
        }); 
      }); // #list
      
    }); // in UTC timezone
    
    describe('in Los Angeles timezone', function() {
      var db = new LocalPostsDatabase('test/fixtures/date', 'America/Los_Angeles');
  
      describe('#list', function() {
        var posts;
    
        before(function(done) {
          db.list(function(err, p) {
            if (err) { return done(err); }
            posts = p;
            return done();
          });
        });
    
        it('should queue pages', function() {
          expect(posts).to.have.length(3);
          expect(posts[0]).to.deep.equal({
            slug: 'hello',
            publishedAt: new Date('2017-09-03T07:00:00.000Z'),
            context: { file: '2017-09-03-hello.md' }
          });
          expect(posts[1]).to.deep.equal({
            slug: 'hello-again',
            publishedAt: new Date('2017-09-04T07:00:00.000Z'),
            context: { file: '2017-09-04-hello-again.md' }
          });
          expect(posts[2]).to.deep.equal({
            slug: 'published',
            publishedAt: new Date('2018-04-26T20:09:27.000Z'),
            context: { file: '2018-04-22-published.md' }
          });
        }); 
      }); // #list
      
    }); // in Los Angeles timezone
  
  }); // with files named by date and slug
  
  describe('with files organized by year and named with month, day, and slug', function() {
    
    describe('in UTC timezone', function() {
      var db = new LocalPostsDatabase('test/fixtures/year');
  
      describe('#list', function() {
        var posts;
    
        before(function(done) {
          db.list(function(err, p) {
            if (err) { return done(err); }
            posts = p;
            return done();
          });
        });
    
        it('should queue pages', function() {
          expect(posts).to.have.length(3);
          expect(posts[0]).to.deep.equal({
            slug: 'hello',
            publishedAt: new Date('2017-09-03T00:00:00.000Z'),
            context: { file: '2017/09-03-hello.md' }
          });
          expect(posts[1]).to.deep.equal({
            slug: 'hello-again',
            publishedAt: new Date('2017-09-04T00:00:00.000Z'),
            context: { file: '2017/09-04-hello-again.md' }
          });
          expect(posts[2]).to.deep.equal({
            slug: 'published',
            publishedAt: new Date('2018-04-26T20:09:27.000Z'),
            context: { file: '2018/04-22-published.md' }
          });
        }); 
      }); // #list
      
    }); // in UTC timezone
    
  }); // with files organized by year and named with month, day, and slug
  
  describe('with files organized by year and month and named with day and slug', function() {
    
    describe('in UTC timezone', function() {
      var db = new LocalPostsDatabase('test/fixtures/year-month');
  
      describe('#list', function() {
        var posts;
    
        before(function(done) {
          db.list(function(err, p) {
            if (err) { return done(err); }
            posts = p;
            return done();
          });
        });
    
        it('should queue pages', function() {
          expect(posts).to.have.length(3);
          expect(posts[0]).to.deep.equal({
            slug: 'hello',
            publishedAt: new Date('2017-09-03T00:00:00.000Z'),
            context: { file: '2017/09/03-hello.md' }
          });
          expect(posts[1]).to.deep.equal({
            slug: 'hello-again',
            publishedAt: new Date('2017-10-04T00:00:00.000Z'),
            context: { file: '2017/10/04-hello-again.md' }
          });
          expect(posts[2]).to.deep.equal({
            slug: 'published',
            publishedAt: new Date('2018-04-26T20:09:27.000Z'),
            context: { file: '2018/04/22-published.md' }
          });
        }); 
      }); // #list
      
    }); // in UTC timezone
    
  }); // with files organized by year and month and named with day and slug
  
});
