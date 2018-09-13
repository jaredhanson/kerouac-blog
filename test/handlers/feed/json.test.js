var chai = require('chai');
var kerouac = require('kerouac')
var handler = require('../../../app/handlers/feed/json');


describe('handlers/feed/json', function() {
  var site = kerouac();
  
  describe('with one post', function() {
    var page, err;

    before(function(done) {
      chai.kerouac.handler(handler())
        .page(function(page) {
          page.url = '/blog/feed.json';
          page.fullURL = 'http://www.example.com/blog/feed.json';
          
          page.site = site;
          page.site.pages = [
            { url: '/blog/2017/09/03/hello/',
              fullURL: 'http://www.example.com/blog/2017/09/03/hello/',
              post: true,
              title: 'Hello, World',
              createdAt: new Date(Date.UTC(2017, 8, 3, 17, 30, 15)) }
          ];
        })
        .end(function(p) {
          page = p;
          done();
        })
        .dispatch();
    });
  
    it('should write feed', function() {
      var expected = [
        '{',
        '  "version": "https://jsonfeed.org/version/1",',
        '  "feed_url": "http://www.example.com/blog/feed.json",',
        '  "items": [',
        '    {',
        '      "id": "http://www.example.com/blog/2017/09/03/hello/",',
        '      "title": "Hello, World",',
        '      "url": "http://www.example.com/blog/2017/09/03/hello/",',
        '      "date_published": "2017-09-03T17:30:15Z"',
        '    }',
        '  ]',
        '}'
      ].join("\n");
      
      expect(page.body).to.equal(expected);
    });
  }); // with one post
  
});
