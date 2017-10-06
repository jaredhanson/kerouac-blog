

exports = module.exports = function() {
  
  function meta(page, next) {
    page.post = true;
    page.title = page.locals.title;
    next();
  }
  
  function render(page, next) {
    page.end('TODO: BLOG ENTRY! ' + page.params.slug)
  }
  
  
  return [
    meta,
    render
  ];
};
