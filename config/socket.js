/**
 * Setup Socket.io config
 */
var io;
var ioSession = require('socket.io-express-session');

// Import Models
var User = require('../models/User');
var TweetData = require('../models/TweetData');

// Import instances
var redis = require('./redis');
var twit = require('./twit');

function bindEvents() {
  io.on('connection', function(socket) {
    var user = new User(socket.handshake.sessionID);

    // Retreive and track user's search terms
    var searchTerms = redis.lrangeAsync(user.id, 0, 1)
      .then(function(terms) {
        twit.track(terms[0]);
        twit.track(terms[1]);
        searchTerms = terms;
      })
      .catch(function(err) {
        console.log(err);
      });

    // All the traffic for every connected client is being sent down which is super
    // no bueno, but Twitter doesn't allow multiple streams under one API key
    twit.on('tweet', function(tweet) {
      var text = tweet.text.toLowerCase();
      var tweetData = new TweetData(tweet);

      if (text.indexOf(' ' + searchTerms[0]) > -1) {
        user.addTweetOne();
        socket.emit('tweet one', {
          tweet: tweetData,
          user: user
        });
      }
      if (text.indexOf(' ' + searchTerms[1]) > -1) {
        user.addTweetTwo();
        socket.emit('tweet two', {
          tweet: tweetData,
          user: user
        });
      }
    });

    socket.on('disconnect', function(socket) {
      // Set timeout to account for page refresh
      setTimeout(function() {
        if (searchTerms.length !== 0) {
          twit.untrack(searchTerms[0]);
          twit.untrack(searchTerms[1]);
        }
        redis.delAsync(user.id)
          .catch(function(err) {
            console.log(err);
          });
      }, 4000);
    });
  });
}

function init(server, session) {
  io = require('socket.io')(server);
  io.use(ioSession(session));

  bindEvents();
}

module.exports = init;
