

exports = module.exports = function() {
  
  function render(page, next) {
    page.end('TODO: BLOG ENTRY! ' + page.params.slug)
  }
  
  
  return [
    render
  ];
};
