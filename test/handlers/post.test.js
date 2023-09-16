var chai = require('chai');
var sinon = require('sinon');
var kerouac = require('kerouac');
var factory = require('../../lib/handlers/post');



describe('handlers/post', function() {
  
  it('should render post', function(done) {
    var blog = new Object();
    blog.entry = sinon.stub().yields(null, {
      title: 'Hello, World',
      content: 'This post was written using Markdown.',
      format: 'md',
      publishedAt: new Date(Date.UTC(2003, 11, 13, 18, 30, 2)),
      modifiedAt: new Date(Date.UTC(2005, 6, 31, 12, 29, 29))
    });
    
    chai.kerouac.page(factory(blog))
      .request(function(page) {
        page.params = { slug: 'hello' };
      })
      .finish(function(p, l) {
        expect(blog.entry.callCount).to.equal(1);
        var call = blog.entry.getCall(0)
        expect(call.args[0]).to.deep.equal({
          slug: 'hello',
          year: undefined,
          month: undefined,
          day: undefined
        });
        
        expect(this).to.render('blog/post')
          .and.beginWith.content('This post was written using Markdown.').of.format('md');
        
        expect(this.isPost).to.be.true;
        
        //page = this;
        //layout = l;
        done();
      })
      .generate();
    
  });
  
  
  
  describe('handler', function() {
    var site = kerouac();
    
    var postsDB = {
      entry: function(){}
    };
    
    describe('with slug as only parameter', function() {
      var page, layout, err;
      
      before(function() {
        sinon.stub(postsDB, 'entry').yields(null, {
          title: 'Hello, World',
          content: 'This post was written using Markdown.',
          publishedAt: new Date(Date.UTC(2003, 11, 13, 18, 30, 2)),
          modifiedAt: new Date(Date.UTC(2005, 6, 31, 12, 29, 29))
        });
      });
    
      after(function() {
        postsDB.entry.restore();
      });
      
      before(function(done) {
        chai.kerouac.page(factory(postsDB))
          .request(function(page) {
            page.site = site;
            page.params = { slug: 'hello' };
            page.context = { file: 'hello.md' }
          })
          .finish(function(p, l) {
            page = this;
            layout = l;
            done();
          })
          .generate();
      });
      
      it('should find package in database', function() {
        expect(postsDB.entry.callCount).to.equal(1);
        var call = postsDB.entry.getCall(0)
        expect(call.args[0]).to.deep.equal({
          slug: 'hello',
          year: undefined,
          month: undefined,
          day: undefined
        });
      });
      
      /*
      it('should set locals', function() {
        expect(page.locals).to.deep.equal({
          title: 'Hello, World',
          content: '<p>This post was written using Markdown.</p>\n',
          publishedAt: new Date('2003-12-13T18:30:02Z'),
          modifiedAt: new Date('2005-07-31T12:29:29Z')
        });
      });
      */
      
      it('should set content', function() {
        expect(page.content).to.contain('This post was written using Markdown.');
      });
      
      it('should render layout', function() {
        expect(layout).to.equal(undefined);
      });
    }); // with slug as only parameter
    
  }); // handler
  
});
