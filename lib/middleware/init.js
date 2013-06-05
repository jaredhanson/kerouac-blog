module.exports = function(params, layout) {
  
  return function(page, next) {
    page.post = true;
    page.title = page.locals.title;
    next();
  }
}
