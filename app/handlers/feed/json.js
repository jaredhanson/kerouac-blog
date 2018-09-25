/**
 * JSON Feed middleware.
 *
 * This middleware generates a feed in JSON Feed format, which can be used to
 * syndicate content to users and other websites.
 *
 * JSON Feed is similar to RSS or Atom, but serialized to JSON rather than XML.
 * It was developed by [Brent Simmons](http://inessential.com/2017/05/17/json_feed)
 * and [Manton Reece](http://www.manton.org/2017/05/json-feed.html).
 *
 * Whether or not a JSON serialization is necessary for web syndication is
 * debatable, and as Dave Winer [notes](http://scripting.com/2017/05/20.html#a010552),
 * this is probably not the most relevant point to focus on.  That being said,
 * if a JSON-based format allows syndication to gain further adoption, that has
 * benefits.
 *
 * Due to the fact that there are multiple, incompatible JSON-based feed
 * formats without a [specific](https://github.com/brentsimmons/JSONFeed/issues/22)
 * MIME type registered in [mime-db](https://github.com/jshttp/mime-db), there
 * is ambiguity about what file extension to use.  The recommendation by the
 * developers of Kerouac.js is to use `json`, which is the type used by the
 * WordPress [plugin](https://wordpress.org/plugins/jsonfeed/) which generates
 * JSON feeds.
 *
 * References:
 *   - [JSON Feed Version 1](https://jsonfeed.org/version/1)
 *   - [JSONFeed](https://github.com/brentsimmons/JSONFeed)
 *   - https://news.ycombinator.com/item?id=14360729
 */
exports = module.exports = function() {
  var linkto = require('../../utils').linkto;
  
  
  return function jsonFeed(feed, next) {
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
    json.version = 'https://jsonfeed.org/version/1';
    
    val = site.get('title');
    if (val) {
      json.title = val;
    }
    val = site.get('description');
    if (val) {
      json.description = val;
    }
    
    if (home) {
      json.home_page_url = linkto(home, feed);
    }
    
    json.feed_url = linkto(feed, feed);
    
    // TODO: user_comment
    // TODO: next_url
    // TODO: icon
    // TODO: favicon
    // TODO: avatar
   
    
    json.items = [];
    (function iter(i, err) {
      if (err) { return next(err); }
      
      post = posts[i];
      if (!post) {
        feed.write(JSON.stringify(json, null, 2));
        feed.end();
        return;
      } // done
    
      item = {};
      item.id = post.locals.id || post.canonicalURL || post.url;
      if (post.locals.title) { item.title = post.locals.title; }
      item.url = linkto(post, feed);
      if (post.locals.publishedAt) { item.date_published = post.locals.publishedAt.toISOString().substring(0,19)+'Z'; }
      if (post.locals.updatedAt) { item.date_modified = post.locals.updatedAt.toISOString().substring(0,19)+'Z'; }
      
      // TODO: convert content to text, stripping links, headings, etc
      //item.content_text = post.content;
      // TODO: content_html
      
      // TODO: if (post.locals.tags) { item.tags = post.locals.tags; }
      
      // TODO: author
      // TODO: tags
      // TODO: external_url
      
      site.render(post.content, { engine: 'md' }, function(err, html) {
        if (err) { return iter(i + 1, err); }
        item.content_html = html.trim();
        json.items.push(item);
        iter(i + 1);
      }, false);
    })(0);
  };
};

exports['@require'] = [];
