exports = module.exports = function() {
  var LocalPostsDatabase = require('../../lib/db/local/posts');
  
  return new LocalPostsDatabase();
};

exports['@implements'] = 'http://i.kerouacjs.org/blog/PostsDatabase';
exports['@singleton'] = true;
exports['@require'] = [];
