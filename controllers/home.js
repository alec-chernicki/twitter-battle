/**
 * Home page controller
 */
var redis = require('../config/redis');

exports.getHome = function(req, res) {
  redis.delAsync(req.sessionId)
    .then(function(int) {
      res.render('landing');
    })
    .catch(function(err) {
      console.log(err);
    });
};

exports.postHome = function(req, res) {
  var searchOne = req.body.searchOne.toLowerCase();
  var searchTwo = req.body.searchTwo.toLowerCase();

  redis.rpushAsync(req.sessionID, searchOne, searchTwo)
    .then(function() {
      res.redirect('dashboard');
    })
    .catch(function() {
      res.redirect('/');
    });
};
