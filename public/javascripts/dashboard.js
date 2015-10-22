var socket = io();

jQuery(function($) {
  // TODO: Add ID's to things being accessed by jQuery
  var $tweetOneList = $('.tweets.one');
  var $tweetTwoList = $('.tweets.two');
  var $searchOneCounterPercentage = $('.data-percentage.one');
  var $searchTwoCounterPercentage = $('.data-percentage.two');
  var $searchOneCount = $('.data-count.one');
  var $searchTwoCount = $('.data-count.two');

  // Create real-time charts
  var Chart = function(id) {
    this.chart = new SmoothieChart({
      millisPerPixel: 73,
      grid: {
        fillStyle: 'transparent',
        strokeStyle: 'transparent',
        verticalSections: 0,
        borderVisible: false
      },
      labels: {
        disabled: true
      },
      maxValue: 100,
      minValue: 0
    });
    this.chartLine = new TimeSeries();
    this.chart.streamTo(document.getElementById(id), 200);
    this.chart.addTimeSeries(this.chartLine, {
      lineWidth: 1,
      strokeStyle: '#1FBCF0',
      fillStyle: 'rgba(33, 174, 236, 0.1)'
    });
  };

  var chartOne = new Chart('chart-one');
  var chartTwo = new Chart('chart-two');

  // Create Socket.io event handlers
  // TODO: Dry this up
  socket.on('tweet one', function(data) {
    $('.data-loading.one').hide();
    $('.search-data.one').show();
    $searchOneCount.text(data.user.searchCountOne);
    $searchOneCounterPercentage.text(data.user.searchPercentageOne + '%');
    $searchTwoCounterPercentage.text(data.user.searchPercentageTwo + '%');
    chartOne.chartLine.append(new Date().getTime(), data.user.searchPercentageOne);

    $tweetOneList.prepend('<li><img class="tweet-image" src="' + data.tweet.userImage + '"><div class="tweet-description"><p class="tweet-name">' + data.tweet.user + '</p><p class="tweet-text">' + data.tweet.text + '</p></li>');
    $('.tweets li:nth-child(3)').remove();
  });

  socket.on('tweet two', function(data) {
    $('.data-loading.two').hide();
    $('.search-data.two').show();
    $searchTwoCount.text(data.user.searchCountTwo);
    $searchOneCounterPercentage.text(data.user.searchPercentageOne + '%');
    $searchTwoCounterPercentage.text(data.user.searchPercentageTwo + '%');
    chartTwo.chartLine.append(new Date().getTime(), data.user.searchPercentageTwo);

    $tweetTwoList.prepend('<li><img class="tweet-image" src="' + data.tweet.userImage + '"><div class="tweet-description"><p class="tweet-name">' + data.tweet.user + '</p><p class="tweet-text">' + data.tweet.text + '</p></li>');
    $('.tweets li:nth-child(3)').remove();
  });
});
