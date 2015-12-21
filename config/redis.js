/**
 * Setup Redis config
 */
var client;
var rtg;

var Promise = require('bluebird');
var redis = require('redis');

// Setup for Heroku's Redis To Go
if (process.env.REDISTOGO_URL) {
  rtg = require('url').parse(process.env.REDISTOGO_URL);
  client = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(':')[1]);
} else {
  client = redis.createClient();
}

function bindEvents() {
  client.on('connect', function() {
    console.log('redis connected');
  });
}

function init() {
  Promise.promisifyAll(client);
  bindEvents();
  return client;
}

module.exports = init();
