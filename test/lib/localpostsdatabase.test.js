var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var LocalPostsDatabase = require('../../lib/localpostsdatabase');


describe('LocalPostsDatabase', function() {
  
  it('should export constructor', function() {
    expect(LocalPostsDatabase).to.be.a('function');
  });
  
  describe('with bare file system layout', function() {
    var db = new LocalPostsDatabase('test/fixtures/bare');
  
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
  
  }); // with bare file system layout
  
  describe('with Jekyll-style file system layout', function() {
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
        delete posts[0].publishedAt;
        expect(posts[0]).to.deep.equal({
          slug: '2017-09-03-hello',
        });
        
        expect(posts[1].publishedAt).to.be.an.instanceof(Date);
        delete posts[1].publishedAt;
        expect(posts[1]).to.deep.equal({
          slug: '2017-09-04-hello-again',
        });
      }); 
    }); // #list
  
  }); // with Jekyll-style file system layout
  
});
