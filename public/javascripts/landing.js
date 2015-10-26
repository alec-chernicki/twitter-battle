var labelListOne = ['happy', 'Los Angeles', 'Apple', 'Red Sox'];
var labelListTwo = ['sad', 'New York', 'Google', 'Yankees'];

jQuery(function($) {
  var $landingForm = $('.search-form');
  var $formErrors = $landingForm.find('.form-error');
  var $formInputs = $landingForm.find('input');
  var $searchLabelOne = $('.form-label.one');
  var $searchLabelTwo = $('.form-label.two');

  mixpanel.track('Landing visited');

  // Validation
  $landingForm.submit(function(e) {
    var inputValues = [];

    $.each($formInputs, function() {
      var $el = $(this);
      var value = $el.val().trim();

      if (value === '') {
        e.preventDefault();
        $formErrors.removeClass('show');
        $el.siblings('.form-error').text('Invalid search term').addClass('show');
      }
      inputValues.push(value);

      if (inputValues[0] === inputValues[1]) {
        e.preventDefault();
        $formErrors.text('Terms must differ').addClass('show');
      }
    });

    mixpanel.track('Search terms submitted', {
      searchOne: inputValues[0],
      searchTwo: inputValues[1]
    });
  });

  // Custom event handler
  $(document).on('checkDisplayLabel', '.form-control input', function() {
    var $label = $(this).prev('span');
    if (this.value !== '' || this === document.activeElement) {
      $label.addClass('hide');
    } else {
      $label.removeClass('hide');
    }
  });

  $(document).on('input focus blur', '.form-control input', function() {
    $(this).trigger('checkDisplayLabel');
  });

  var fadeLabel = function(label, list) {
    (function fade(i) {
      label.text(list[i]).fadeIn(1000).delay(600).fadeOut(1000, function() {
        fade((i + 1) % list.length);
      });
    })(0);
  };

  fadeLabel($searchLabelOne, labelListOne);
  fadeLabel($searchLabelTwo, labelListTwo);
});
