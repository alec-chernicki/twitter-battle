jQuery(function($) {
  var labelListOne = ['happy', 'Los Angeles', 'Apple', 'Red Sox'];
  var labelListTwo = ['sad', 'New York', 'Google', 'Yankees'];
  var $searchLabelOne = $('.form-label.one');
  var $searchInputOne = $('.search-one-input');
  var $searchErrorOne = $('.form-error.one');
  var $searchLabelTwo = $('.form-label.two');
  var $searchInputTwo = $('.search-two-input');
  var $searchErrorTwo = $('.form-error.two');
  var $landingForm = $('.search-form');

  // Validation
  $landingForm.submit(function(e) {
    var searchOne = $searchInputOne.val().trim();
    var searchTwo = $searchInputTwo.val().trim();
    // TODO: Dry this up and make it pretty
    if (searchOne === '') {
      e.preventDefault();
      $searchErrorTwo.removeClass('show');
      $searchErrorOne.text('Invalid search term').addClass('show');
    }
    else if (searchTwo === '') {
      e.preventDefault();
      $searchErrorOne.removeClass('show');
      $searchErrorTwo.text('Invalid search term').addClass('show');
    }
    else if (searchOne.toLowerCase() === searchTwo.toLowerCase()) {
      e.preventDefault();
      $searchErrorOne.text('Terms must differ').addClass('show');
      $searchErrorTwo.text('Terms must differ').addClass('show');
    }
  });

  // Animation
  $('.form-control input').bind('checkVal', function() {
    var $label = $(this).prev('span');
    if (this.value !== '' || this === document.activeElement) {
      $label.addClass('hide');
    } else {
      $label.removeClass('hide');
    }
  }).on('focus blur input propertychange paste', function() {
    $(this).trigger('checkVal');
  });

  // TODO: DRY this up
  !function fadeListOne(i) {
    $searchLabelOne.text(labelListOne[i]).fadeIn(1000).delay(600).fadeOut(1000, function() {
      fadeListOne((i + 1) % labelListOne.length);
    });
  }(0);

  !function fadeListTwo(i) {
    $searchLabelTwo.text(labelListTwo[i]).fadeIn(1000).delay(600).fadeOut(1000, function() {
      fadeListTwo((i + 1) % labelListTwo.length);
    });
  }(0);
});
