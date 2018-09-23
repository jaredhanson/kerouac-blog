/**
 * RSS-in-JSON middleware.
 *
 * This middleware generates a feed in RSS-in-JSON format, which can be used to
 * syndicate content to users and other websites.
 *
 * RSS-in-JSON is a mapping of RSS but serialized to JSON rather than XML.
 *
 * Dave Winer proposed this format for discussion in 2012, while also providing
 * feeds for Scripting News as an experiement.  As he retrospectively [noted](http://scripting.com/2017/05/20.html#a010552)
 * on [multiple](http://scripting.com/2017/05/30.html#a110554) [occasions](http://scripting.com/2017/06/05.html#a080612),
 * this format did not gain traction.  Despite that, there have been attempts
 * since that time to introduce other JSON-based feed formats, notably JSON Feed
 * which was announced with more fanfare.
 *
 * Due to the fact that there are multiple, incompatible JSON-based feed
 * formats without a [specific](https://github.com/brentsimmons/JSONFeed/issues/22)
 * MIME type registered in [mime-db](https://github.com/jshttp/mime-db), there
 * is ambiguity about what file extension to use.  The recommendation by the
 * developers of Kerouac.js is to use `rssjs`, which is the type used by the
 * WordPress [plugin](https://wordpress.org/plugins/rssjs/) which generates
 * RSS-in-JS feeds.
 *
 * References:
 *   - [What is rss.js?](http://rssjs.org/)
 *   - [RSS in JSON, for real?](http://scripting.com/stories/2012/09/10/rssInJsonForReal.html)
 *   - [The story of RSS-in-JSON](http://scripting.com/2017/06/05.html#a080612)
 *   - [RSS-in-JSON is a feed format](https://github.com/scripting/Scripting-News/tree/master/rss-in-json)
 *   - [Implement a JSON feed using rssjs.org spec](https://core.trac.wordpress.org/ticket/25639)
 */
exports = module.exports = function() {
  var linkto = require('../../utils').linkto;
  
  
  return function rssjsFeed(feed, next) {
    var site = feed.site
      , home, posts, post, item, val, i, len;
  
    home = site.pages.filter(function(p) {
      return (p.meta && p.meta.home == true);
    });
    if (home.length) { home = home[0]; }
    else { home = undefined; }

    posts = site.pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts.
      return (p.meta && p.meta.post == true);
    });
    
    
    var json = {};
    json.rss = {};
    json.rss.version = '2.0';
    
    json.rss.items = [];
    for (i = 0, len = posts.length; i < len; i++) {
      post = posts[i];
    
      item = {};
      item.guid = post.locals.id || post.canonicalURL || post.url;
      if (post.locals.title) { item.title = post.locals.title; }
      
      item.link = linkto(post, feed);
      if (post.locals.publishedAt) { item.pubDate = post.locals.publishedAt.toUTCString(); }
      
      
      json.rss.items.push(item);
    };
    
    feed.write(JSON.stringify(json, null, 2));
    feed.end();
  }
}

exports['@require'] = [];
