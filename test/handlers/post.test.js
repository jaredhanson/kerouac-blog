var chai = require('chai');
var handler = require('../../lib/handlers/post');


describe('handlers/post', function() {
  
  describe.only('with one page', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.handler(handler())
        .page(function(page) {
          page.params = { slug: 'hello' };
        })
        .end(function(p) {
          page = p;
          done();
        })
        .dispatch();
    });
  
    it('should have correct body', function() {
      var expected = 'TODO: BLOG ENTRY! hello';
      
      expect(page.body).to.equal(expected);
    });
    
    it('should set sitemap property', function() {
      //expect(page.sitemap).to.equal(true);
    });
  }); // with one page
  
});
