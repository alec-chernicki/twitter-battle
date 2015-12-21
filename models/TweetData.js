var TweetData = function(tweet, count, totalCount) {
  this.user = tweet.user.screen_name;
  this.text = tweet.text;
  this.userImage = tweet.user.profile_image_url;
};

module.exports = TweetData;
