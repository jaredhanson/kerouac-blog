var utils = require('../utils')

module.exports = function(params, layout) {
  
  return function render(page, next) {
    if (params) utils.merge(page.locals, params);
    if (layout && !page.layout) {
      page.layout = layout;
      page.locals.layout = layout;
    }    
    next();
  }
}
