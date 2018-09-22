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
  
  
  return function feed(page, next) {
    var site = page.site
      , pages, post, item, val, i, len;
    
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
    
    pages = site.pages.filter(function(p) {
      return p.index == true;
    });
    if (pages.length) {
      json.home_page_url = linkto(pages[0], page);
    }
    
    json.feed_url = linkto(page, page);
    
    // TODO: Get the blog index and set as `link` element
    
    pages = site.pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts, as indicated
      // by the `post` property.
      return p.post == true;
    });
    
    json.items = [];
    for (i = 0, len = pages.length; i < len; i++) {
      post = pages[i];
    
      item = {};
      item.id = post.fullURL || post.absoluteURL || post.url;
      if (post.title) { item.title = post.title; }
      if (post.tags) { item.tags = post.tags; }
      
      item.url = linkto(post, page);
      if (post.createdAt) { item.date_published = post.createdAt.toISOString().substring(0,19)+'Z'; }
      if (post.modifiedAt) { item.date_modified = post.modifiedAt.toISOString().substring(0,19)+'Z'; }
      
      // TODO: convert content to text, stripping links, headings, etc
      item.content_text = post.content;
      // TODO: content_html
      
      
      json.items.push(item);
    };
    
    page.write(JSON.stringify(json, null, 2));
    page.end();
  };
};

exports['@require'] = [];
