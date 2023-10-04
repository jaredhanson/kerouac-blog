var chai = require('chai');
var sinon = require('sinon');
var kerouac = require('kerouac');
var factory = require('../../lib/handlers/index');


describe('handlers/index', function() {
  
  it('should render index', function(done) {
    var blog = new Object();
    blog.entries = sinon.stub().yields(null, [ {
      slug: 'hello-world',
    } ]);
    blog.entry = sinon.stub().yields(null, {
      slug: 'hello-world',
      title: 'Hello, World',
      content: 'Hello, world! How are you today?',
      format: 'md',
      publishedAt: new Date('2003-12-13T18:30:02Z')
    });
    
    
    chai.kerouac.page(factory(blog))
      .request(function(page) {
        // TODO: clean this up and assert arguments
        page.compile = sinon.stub().yields(null, '<p>Hello, world! How are you today?</p>');
      })
      .finish(function() {
        // TODO: what is it rendering???
        //expect(this).to.render('blog/post')
      
      
        expect(this.locals).to.deep.equal({
          entries: [ {
            slug: 'hello-world',
            title: 'Hello, World',
            content: '<p>Hello, world! How are you today?</p>',
            format: 'html',
            publishedAt: new Date('2003-12-13T18:30:02Z')
          } ]
        });
      
        console.log(this.locals);
      
      
        /*
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
        });
        */
        done();
      })
      .generate();
  });
  
});
