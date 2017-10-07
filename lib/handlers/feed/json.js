var uri = require('url')
  , builder = require('xmlbuilder')
  , qformat = require('../../utils').qformat;


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
      , pages, post, item, val, i, len;
    
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
      json.description = val;
    }
    
    pages = page.pages.filter(function(p) {
      return p.index == true && p.section == page.section;
    });
    if (pages.length) {
      json.home_page_url = qformat(pages[0].url, url);
    }
    
    json.feed_url = qformat(page.url, url);
    
    // TODO: Get the blog index and set as `link` element
    
    pages = page.pages.filter(function(p) {
      // Filter the set of pages to just those that are blog posts, as indicated
      // by the `post` property.  Further filter the set of pages to just those
      // within the same section of the site, in case there are multiple blogs.
      return p.post == true && p.section == page.section;
    });
    
    json.items = [];
    for (i = 0, len = pages.length; i < len; i++) {
      post = pages[i];
    
      item = {};
      item.id = qformat(post.url, url);
      if (post.title) { item.title = post.title; }
      if (post.tags) { item.tags = post.tags; }
      
      item.url = qformat(post.url, url);
      if (post.createdAt) { item.date_published = post.createdAt.toISOString().substring(0,19)+'Z'; }
      if (post.modifiedAt) { item.date_modified = post.modifiedAt.toISOString().substring(0,19)+'Z'; }
      
      // TODO: convert content text to markdown, from other formats?
      item.content_text = post.content;
      // TODO: content_html
      
      
      json.items.push(item);
    };
    
    page.write(JSON.stringify(json, null, 2));
    page.end();
  };
};
