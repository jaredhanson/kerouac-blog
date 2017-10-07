var uri = require('url')
  , builder = require('xmlbuilder');


/**
 * JSON Feed middleware.
 *
 * This middleware generates a feed in JSON Feed format, which can be used to
 * syndicate content to users and other websites.
 *
 * References:
 *   - [JSON Feed Version 1](https://jsonfeed.org/version/1)
 */
exports = module.exports = function() {
  
  return function feed(page, next) {
    var site = page.site
      , sect = page.section || site
      , pages = page.pages
      , post, item, val, i, len;
    
    var url = site.get('base url');
    if (url) {
      url = uri.parse(url);
    }
    
    var json = {};
    json.version = 'https://jsonfeed.org/version/1';
    
    val = sect.get('title') || site.get('title');
    if (val) {
      json.title = val;
    }
    val = sect.get('description') || site.get('description');
    if (val) {
      //chan.e('description', val);
    }
    
    if (url) { url.pathname = page.url; }
    json.feed_url = url ? uri.format(url) : page.url;
    
    // TODO: Get the blog index and set as `link` element
    
    pages = pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts, as indicated
      // by the `post` property.  Further filter the set of pages to just those
      // within the same section of the site, in case there are multiple blogs.
      return p.post == true && p.section == page.section;
    });
    
    json.items = [];
    for (i = 0, len = pages.length; i < len; i++) {
      post = pages[i];
      if (url) { url.pathname = post.url; }
    
      item = {};
      if (post.title) { item.title = post.title; }
      if (post.url) { item.url = url ? uri.format(url) : post.url; }
      //if (post.createdAt) { item.e('pubDate', post.createdAt.toUTCString()); }
      json.items.push(item);
    };
    
    page.write(JSON.stringify(json, null, 2));
    page.end();
  };
};
