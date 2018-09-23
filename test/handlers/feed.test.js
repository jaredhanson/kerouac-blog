var chai = require('chai');
var kerouac = require('kerouac')
var factory = require('../../app/handlers/feed');


describe('handlers/feed', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    var site = kerouac();
  
    describe('with one post', function() {
      var page, layout, err;

      before(function(done) {
        chai.kerouac.handler(factory())
          .page(function(page) {
            page.site = site;
            page.site.pages = [
              { url: '/2003/12/13/hello-world/',
                canonicalURL: 'http://www.example.com/blog/2003/12/13/hello-world/',
                meta: { post: true },
                locals: {
                  title: 'Hello, World',
                  publishedAt: new Date('2003-12-13T18:30:02Z'),
                  modifiedAt: new Date('2005-07-31T12:29:29Z')
                }
              }
            ];
          })
          .render(function(p, l) {
            page = p;
            layout = l;
            done();
          })
          .dispatch();
      });
      
      it('should set meta', function() {
        expect(page.meta).to.deep.equal({
          home: true,
        });
      });
      
      it('should set locals', function() {
        expect(page.locals).to.deep.equal({
          posts: [{
            title: 'Hello, World',
            publishedAt: new Date('2003-12-13T18:30:02Z'),
            modifiedAt: new Date('2005-07-31T12:29:29Z')
          }],
          content: undefined
        });
      });
  
      it('should render layout', function() {
        expect(layout).to.equal(undefined);
      });
    }); // with one post
    
  }); // handler
  
});
