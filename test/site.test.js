/* global describe, it */

var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../app/site');
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
  
});



/*
describe('kerouac-blog', function() {
  
  describe('binding to directory with posts named using dates and slugs', function() {
    var site = blog('test/fixtures/date');
    var queue = new Queue();
    
    before(function(done) {
      site._blocks[0].call(queue, function(err) {
        if (err) { return done(err); }
        return done();
      });
    });
    
    it('should queue pages', function() {
      expect(queue._q).to.have.length(2);
      expect(queue._q).to.include('/2017/09/03/hello.html');
      expect(queue._q).to.include('/2017/09/04/hello-again.html');
    });
  });
  
  describe('binding to directory with posts named using bare slugs', function() {
    var site = blog('test/fixtures/bare');
    var queue = new Queue();
    
    before(function(done) {
      site._blocks[0].call(queue, function(err) {
        if (err) { return done(err); }
        return done();
      });
    });
    
    it('should queue pages', function() {
      var path;
      
      expect(queue._q).to.have.length(1);
      
      path = queue._q[0].split('/');
      expect(path[1]).to.have.length(4); // year
      expect(path[2]).to.have.length(2); // month
      expect(path[3]).to.have.length(2); // day
      expect(path[4]).to.equal('hello.html'); // slug
    });
  });
  
});
*/
