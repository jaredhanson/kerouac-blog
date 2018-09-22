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
          publishedAt: new Date(Date.UTC(2003, 11, 13, 18, 30, 2)),
          modifiedAt: new Date(Date.UTC(2005, 6, 31, 12, 29, 29))
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
      
      it('should set locals', function() {
        expect(page.locals).to.deep.equal({
          title: 'Hello, World',
          content: '<p>This post was written using Markdown.</p>\n',
          publishedAt: new Date('2003-12-13T18:30:02Z'),
          modifiedAt: new Date('2005-07-31T12:29:29Z')
        });
      });
      
      it('should set content', function() {
        expect(page.content).to.contain('This post was written using Markdown.');
      });
      
      it('should render layout', function() {
        expect(layout).to.equal(undefined);
      });
    });
    
  }); // handler
  
});
