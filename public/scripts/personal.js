$(document).ready(function () {
  var $timeline_block = $('.content section')
  //hide timeline blocks which are outside the viewport
  $timeline_block.each(function () {
    if ($(this).offset().top > $(window).scrollTop() + $(window).height() * 0.75) {
      $(this).addClass('is-hidden')
    }
  })
  //on scolling, show/animate timeline blocks when enter the viewport
  $(window).on('scroll', function () {
    $timeline_block.each(function () {
      if ($(this).offset().top <= $(window).scrollTop() + $(window).height() * 0.75 && $(this).hasClass('is-hidden')) {
        $(this).removeClass('is-hidden').addClass('bounce-in')
      }
    })
  })

  $('.content article > h3').on('click', function () {
    if ($(this).hasClass('hide-more')) {
      $(this).removeClass('hide-more')
      $(this).parent().find('section').fadeIn()
    } else {
      $(this).addClass('hide-more')
      $(this).parent().find('section').fadeOut()
    }
  })
})
