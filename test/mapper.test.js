var $require = require('proxyquire');
var chai = require('chai');
var sinon = require('sinon');
var Mapper = require('../lib/mapper');
var Blog = require('../lib/blog');


describe('Mapper', function() {

  it('should request entries', function(done) {
    var blog = new Blog('test/fixtures/date');
    
    chai.kerouac.map(new Mapper(blog))
      .close(function() {
        expect(this).to.request([
          '/2017/09/03/hello.html',
          '/2017/09/04/hello-again.html',
          '/2018/04/26/published.html',
          '/feed.atom',
          '/index.html'
        ]);
        done();
      })
      .generate();
  }); // should request chapters

});
