/**
 * Dashboard controller
 */
var redis = require('../config/redis');

exports.getDashboard = function(req, res) {
  redis.lrangeAsync(req.sessionID, 0, 1)
    .then(function(searchTerms) {
      res.render('dashboard', {
        searchOne: searchTerms[0].toUpperCase(),
        searchTwo: searchTerms[1].toUpperCase()
      });
    })
    .catch(function() {
      return res.redirect('/');
    })
};
