var User = function(id) {
  this.id = id;
  this.searchCountOne = 0;
  this.searchCountTwo = 0;
  this.totalCount = 0;
};

User.prototype.addTweetOne = function(searchCount) {
  this.searchCountOne++;
  this.totalCount++;
  this.searchPercentageOne = ((this.searchCountOne / this.totalCount) * 100).toFixed(1);
};

User.prototype.addTweetTwo = function(searchCount) {
  this.searchCountTwo++;
  this.totalCount++;
  this.searchPercentageTwo = ((this.searchCountTwo / this.totalCount) * 100).toFixed(1);
};

module.exports = User;
