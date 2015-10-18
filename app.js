// Initialize Express middleware
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
    // TODO: MemoryStore isn't fit for prod, switch to Redis store, make sure compat w/ Socket.io
var  session = require('express-session')({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: true
});

// Creating new express app
var express = require('express');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser(process.env.EXPRESS_SESSION_SECRET));
app.use(express.static(__dirname + '/public'));
app.use(session);

// Attaching express app to HTTP server
var http = require('http');
var server = http.createServer(app);
server.listen(app.get('port'));

// Redis variables
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(":")[1]);
}
else {
  var redis = require("redis").createClient();
}
redis.on('connect', function() {
  console.log('redis connected');
});

// Twitter stream variables
var Twitter = require('twit');
var twit = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Define Objects
var User = function(id){
  this.id = id;
  this.searchCountOne = 0;
  this.searchCountTwo = 0;
  this.totalCount = 0;
};

User.prototype.addTweetOne = function(searchCount) {
  this.searchCountOne++;
  this.totalCount++;
};

User.prototype.addTweetTwo = function(searchCount) {
  this.searchCountTwo++;
  this.totalCount++;
};

var TweetData = function(tweet, count, totalCount) {
  this.user = tweet.user.screen_name;
  this.text = tweet.text;
  this.userImage = tweet.user.profile_image_url;
  this.searchCount =  count;
  this.searchPercentage = (count / totalCount) * 100;
};

// Helper Methods
var deleteUser = function(id){
  redis.del(id, function(err, reply) {
    if (err) console.log(err);
  });
};

// Creates a new instance of Socket.io
var ioSession = require('socket.io-express-session');
var io = require('socket.io')(server);
io.use(ioSession(session));

io.on('connection', function(socket) {
  var stream;
  var user = new User(socket.handshake.sessionID);

  redis.lrange(user.id, 0, 1, function(err, searchTerms) {
    if (err || !searchTerms[0] || !searchTerms[1]) return;

    // TODO: This is creating a new stream on every new connection which is very bad.
    // Once my JavaScript skillz level up come back and refactor this out into a global var.
    stream = twit.stream('statuses/filter', { track: searchTerms });

    stream.on('tweet', function(tweet) {
      var text = tweet.text.toLowerCase();

      if (text.indexOf(' ' + searchTerms[0]) !== -1) {
        user.addTweetOne();
        socket.volatile.emit('tweet one', new TweetData(tweet, user.searchCountOne, user.totalCount));
      }
      if (text.indexOf(' ' + searchTerms[1]) !== -1) {
        user.addTweetTwo();
        socket.volatile.emit('tweet two', new TweetData(tweet, user.searchCountTwo, user.totalCount));
      }
    });
  });

  socket.on('disconnect', function(socket) {
    if (stream) stream.stop();
    // Set timeout to account for page refresh
    setTimeout(function() {
      deleteUser(user.id);
    }, 4000);
  });
});

// Create Express routes
app.get('/', function(req, res) {
  deleteUser(req.sessionID);
  res.render('landing');
});

app.post('/', function(req, res) {
  var searchOne = req.body.searchOne;
  var searchTwo = req.body.searchTwo;

  if (!searchOne || !searchTwo) {
    res.redirect('/');
  }
  else {
    redis.rpush(req.sessionID, searchOne.toLowerCase(), searchTwo.toLowerCase(), function(err, reply) {
      res.redirect('/dashboard');
    });
  }
});

app.get('/dashboard', function(req, res) {
  redis.lrange(req.sessionID, 0, 1, function(err, searchTerms) {
    if (err || searchTerms.length === 0) {
      res.redirect('/');
    }
    else {
      res.render('dashboard', {
        searchOne: searchTerms[0].toUpperCase(),
        searchTwo: searchTerms[1].toUpperCase()
      });
    }
  });
});
