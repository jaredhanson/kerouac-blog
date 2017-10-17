
// https://wordpress.org/plugins/rssjs/

// http://scripting.com/2017/05/30.html#a110554


/**
 * RSS-in-JSON middleware.
 *
 * This middleware generates a feed in RSS-in-JSON format, which can be used to
 * syndicate content to users and other websites.
 *
 * RSS-in-JSON is a mapping of RSS but serialized to JSON rather than XML.
 *
 * Dave Winer proposed this format for discussion in 2012, while also providing
 * feeds for Scripting News as an experiement.  As he subsequently [noted](http://scripting.com/2017/05/20.html#a010552)
 * on [multiple](http://scripting.com/2017/05/30.html#a110554) [occasions](http://scripting.com/2017/06/05.html#a080612),
 * this format did not gain traction.
 *
 *
 * References:
 *   - [What is rss.js?](http://rssjs.org/)
 *   - [RSS in JSON, for real?](http://scripting.com/stories/2012/09/10/rssInJsonForReal.html)
 *   - [The story of RSS-in-JSON](http://scripting.com/2017/06/05.html#a080612)
 *   - [RSS-in-JSON is a feed format](https://github.com/scripting/Scripting-News/tree/master/rss-in-json)
 */
exports = module.exports = function() {
  
  return function rssjs(page, next) {
    
  }
}
