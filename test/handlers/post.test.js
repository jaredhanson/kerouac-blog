var chai = require('chai');
var sinon = require('sinon');
var kerouac = require('kerouac');
var factory = require('../../app/handlers/post');



describe('handlers/post', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  
  describe('handler', function() {
    var site = kerouac();
    
    var postsDB = {
      find: function(){}
    };
    
    describe('with posts named using bare slugs', function() {
      var page, layout, err;
      
      before(function() {
        sinon.stub(postsDB, 'find').yields(null, {
          title: 'Hello, World',
          content: 'This post was written using Markdown.',
          publishedAt: new Date(Date.UTC(2017, 8, 3, 17, 30, 15)),
          modifiedAt: new Date(Date.UTC(2017, 8, 3, 17, 32, 15))
        });
      });
    
      after(function() {
        postsDB.find.restore();
      });
      
      before(function(done) {
        chai.kerouac.handler(factory(postsDB))
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
      
      it('should find package in database', function() {
        expect(postsDB.find.callCount).to.equal(1);
        var call = postsDB.find.getCall(0)
        expect(call.args[0]).to.deep.equal({
          slug: 'hello',
          year: undefined,
          month: undefined,
          day: undefined
        });
      });
      
      it('should set meta', function() {
        expect(page.meta).to.deep.equal({
          post: true,
        });
      });
      
      /*
      it('should set metadata', function() {
        expect(page.post).to.equal(true);
        expect(page.title).to.equal('Hello, World');
      });
      */
      
      it('should set markup', function() {
        //expect(page.markup).to.equal('md');
        expect(page.content).to.contain('This post was written using Markdown.');
      });
      
      it('should render with locals', function() {
        expect(page.locals.title).to.equal('Hello, World');
        expect(page.locals.content).to.equal('<p>This post was written using Markdown.</p>\n');
      });
      
      it('should render layout', function() {
        expect(layout).to.equal(undefined);
      });
    });
    
  }); // handler
  
});
