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
  var chartOne = new SmoothieChart({
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
  var chartOneLine = new TimeSeries();
  chartOne.streamTo(document.getElementById("chart-one"), 200);
  chartOne.addTimeSeries(chartOneLine, {
    lineWidth: 1,
    strokeStyle: '#1FBCF0',
    fillStyle: 'rgba(33, 174, 236, 0.1)'
  });

  var chartTwo = new SmoothieChart({
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
  var chartTwoLine = new TimeSeries();
  chartTwo.streamTo(document.getElementById("chart-two"), 200);
  chartTwo.addTimeSeries(chartTwoLine, {
    lineWidth: 1,
    strokeStyle: '#1FBCF0',
    fillStyle: 'rgba(33, 174, 236, 0.1)'
  });

  // Create Socket.io event handlers
  // TODO: Dry this up
  socket.on('tweet one', function(data) {
    $('.data-loading.one').hide();
    $('.search-data.one').show();
    var searchPercentage = data.searchPercentage.toFixed(1);
    $searchOneCount.text(data.searchCount);
    $searchOneCounterPercentage.text(searchPercentage + '%');
    $searchTwoCounterPercentage.text((100 - searchPercentage).toFixed(1) + '%');
    chartOneLine.append(new Date().getTime(), searchPercentage);

    $tweetOneList.prepend('<li><img class="tweet-image" src="' + data.userImage + '"><div class="tweet-description"><p class="tweet-name">' + data.user + '</p><p class="tweet-text">' + data.text + '</p></li>');
    $('.tweets li:nth-child(3)').remove();
  });

  socket.on('tweet two', function(data) {
    $('.data-loading.two').hide();
    $('.search-data.two').show();
    var searchPercentage = data.searchPercentage.toFixed(1);
    $searchTwoCount.text(data.searchCount);
    $searchOneCounterPercentage.text((100 - searchPercentage).toFixed(1) + '%');
    $searchTwoCounterPercentage.text(searchPercentage + '%');
    chartTwoLine.append(new Date().getTime(), searchPercentage);

    $tweetTwoList.prepend('<li><img class="tweet-image" src="' + data.userImage + '"><div class="tweet-description"><p class="tweet-name">' + data.user + '</p><p class="tweet-text">' + data.text + '</p></li>');
    $('.tweets li:nth-child(3)').remove();
  });
});
