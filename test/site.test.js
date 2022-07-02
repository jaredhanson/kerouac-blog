/* global describe, it */

var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../lib/index');
var MockSite = require('./mocks/site');
var MockQueue = require('./mocks/queue');


describe('site', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.deep.equal([
      'http://i.kerouacjs.org/Site',
      'http://i.kerouacjs.org/blog/Site'
    ]);
    expect(factory['@singleton']).to.be.undefined;
  });
  
  /*
  describe('create with one post', function() {
    function kerouac() {
      return new MockSite();
    }
    var factory = $require('../lib/index', { 'kerouac': kerouac });

    var postsDB = {
      list: sinon.stub().yields(null, [ {
        slug: 'hello-world',
        publishedAt: new Date('2003-12-13T18:30:02Z')
      } ])
    };
    
    function feedHandler() {};
    function postHandler() {};
    function atomFeedHandler() {};
    function rssFeedHandler() {};
    function rdfFeedHandler() {};
    function jsonFeedHandler() {};
    var site = factory(feedHandler, postHandler, atomFeedHandler, rssFeedHandler, rdfFeedHandler, jsonFeedHandler, postsDB);
    
    it('should add routes', function() {
      expect(site._routes.length).to.equal(7);
      expect(site._routes[0].path).to.equal('/:year/:month/:day/:slug.html');
      expect(site._routes[0].handler).to.equal(postHandler);
      expect(site._routes[1].path).to.equal('/index.html');
      expect(site._routes[1].handler).to.equal(feedHandler);
      expect(site._routes[2].path).to.equal('/feed.atom');
      expect(site._routes[2].handler).to.equal(atomFeedHandler);
      expect(site._routes[3].path).to.equal('/feed.rss');
      expect(site._routes[3].handler).to.equal(rssFeedHandler);
      expect(site._routes[4].path).to.equal('/feed.rdf');
      expect(site._routes[4].handler).to.equal(rdfFeedHandler);
      expect(site._routes[5].path).to.equal('/feed.json');
      expect(site._routes[5].handler).to.equal(jsonFeedHandler);
      expect(site._routes[6].path).to.equal('/sitemap.xml');
    });
    
    describe('and then binding content', function() {
      var queue = new MockQueue();
      
      before(function(done) {
        site._bind.call(queue, function(err) {
          if (err) { return done(err); }
          return done();
        });
      });
      
      it('should queue content', function() {
        expect(queue._q).to.have.length(1);
        expect(queue._q[0]).to.equal('/2003/12/13/hello-world.html');
      });
    }); // and then binding content
  
  }); // create with one post
  */
  
  /*
  describe('create with one post, published on date with single digit month and day', function() {
    function kerouac() {
      return new MockSite();
    }
    var factory = $require('../lib/index', { 'kerouac': kerouac });

    var postsDB = {
      list: sinon.stub().yields(null, [ {
        slug: 'hello-world',
        publishedAt: new Date('2003-02-03T18:30:02Z')
      } ])
    };
    
    function feedHandler() {};
    function postHandler() {};
    function atomFeedHandler() {};
    function rssFeedHandler() {};
    function rdfFeedHandler() {};
    function jsonFeedHandler() {};
    var site = factory(feedHandler, postHandler, atomFeedHandler, rssFeedHandler, rdfFeedHandler, jsonFeedHandler, postsDB);
    
    describe('and then binding content', function() {
      var queue = new MockQueue();
      
      before(function(done) {
        site._bind.call(queue, function(err) {
          if (err) { return done(err); }
          return done();
        });
      });
      
      it('should queue content', function() {
        expect(queue._q).to.have.length(1);
        expect(queue._q[0]).to.equal('/2003/02/03/hello-world.html');
      });
    }); // and then binding content
    
  }); // create with one post, published on date with single digit month and day
  */
  
});
