var chai = require('chai');
var kerouac = require('kerouac')
var factory = require('../../app/handlers/post');


/*
describe('handlers/post', function() {
  var site = kerouac();
  
  
  describe.skip('handler', function() {
    
  
  
    describe('with posts named using bare slugs', function() {
      var page, layout, err;

      before(function(done) {
        chai.kerouac.handler(handler('test/fixtures/bare'))
          .page(function(page) {
            page.site = site;
            page.params = { slug: 'hello' };
          })
          .render(function(p, l) {
            page = p;
            layout = l;
            done();
          })
          .dispatch();
      });
  
      it('should set metadata', function() {
        expect(page.post).to.equal(true);
        expect(page.title).to.equal('Hello, World');
      });
  
      it('should set markup', function() {
        expect(page.markup).to.equal('md');
        expect(page.content).to.contain('This post was written using Markdown.');
      });
  
      it('should render with locals', function() {
        expect(page.locals.title).to.equal('Hello, World');
        expect(page.locals.content).to.equal('<p>This post was written using Markdown.</p>\n');
      });
    
      it('should render layout', function() {
        expect(layout).to.equal(undefined);
      });
    }); // with posts named using bare slugs
  
  }); // handler
  
});
*/
