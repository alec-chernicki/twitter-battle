/**
 * Initialize middleware
 */
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var path = require('path');
// TODO: MemoryStore isn't fit for prod, switch to Redis store, make sure compat w/ Socket.io
var session = require('express-session')({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: true
});

/**
 * Create Express app
 */
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

/**
 * Setup server for Socket.io
 */
var server = app.listen(app.get('port'));

/**
 * Initialize Socket.io server
 */
var io = require('./config/socket');
io(server, session);

/**
 * Controllers
 */
var homeController = require('./controllers/home');
var dashboardController = require('./controllers/dashboard');

/**
 * Assign routes
 */
app.get('/', homeController.getHome);
app.post('/', homeController.postHome);

app.get('/dashboard', dashboardController.getDashboard);
