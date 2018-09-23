var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var LocalPostsDatabase = require('../../lib/localpostsdatabase');


describe('LocalPostsDatabase', function() {
  
  it('should export constructor', function() {
    expect(LocalPostsDatabase).to.be.a('function');
  });
  
  describe('with files named by slug', function() {
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
        expect(posts).to.have.length(1);

        expect(posts[0].publishedAt).to.be.an.instanceof(Date);
        delete posts[0].publishedAt;
        expect(posts[0]).to.deep.equal({
          slug: 'hello',
        });
      }); 
    }); // #list
  
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
          expect(posts).to.have.length(2);

          expect(posts[0].publishedAt).to.be.an.instanceof(Date);
          expect(posts[0]).to.deep.equal({
            slug: 'hello',
            publishedAt: new Date('2017-09-03T00:00:00.000Z')
          });
        
          expect(posts[1].publishedAt).to.be.an.instanceof(Date);
          expect(posts[1]).to.deep.equal({
            slug: 'hello-again',
            publishedAt: new Date('2017-09-04T00:00:00.000Z')
          });
        }); 
      }); // #list
      
    }); // in UTC timezone
    
    describe('in Lost_Angeles timezone', function() {
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
          expect(posts).to.have.length(2);

          expect(posts[0].publishedAt).to.be.an.instanceof(Date);
          expect(posts[0]).to.deep.equal({
            slug: 'hello',
            publishedAt: new Date('2017-09-03T07:00:00.000Z')
          });
        
          expect(posts[1].publishedAt).to.be.an.instanceof(Date);
          expect(posts[1]).to.deep.equal({
            slug: 'hello-again',
            publishedAt: new Date('2017-09-04T07:00:00.000Z')
          });
        }); 
      }); // #list
      
    }); // in Lost_Angeles timezone
  
  }); // with files named by date and slug
  
});
