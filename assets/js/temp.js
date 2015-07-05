// Start music.
$(".video-self").tubeplayer({
  width: 0.001,
  height: 0.001,
  initialVideo: "UE9fPWy1_o4",
  autoPlay: true,
  onPlayerEnded: function(){
    $(".video-self").tubeplayer('play');
  }
});

if(localStorage.getItem('volume') == 'off') {
  $('.music-icon').removeClass('active');
}

if(localStorage.getItem('volumeValue') != null) {
  $('.video-self').tubeplayer('volume', localStorage.getItem('volumeValue'));
  $('.volume').val(localStorage.getItem('volumeValue'));
} else {
  $('.volume').val('75');
  $('.video-self').tubeplayer('volume', 75);
}

// Set volume.
$('.volume').on('blur', function() {
  var val = $(this).val();

  if(val > 100) val = 100;
  if(val < 0) val = 0;
  if( ! val) val = 75;

  $('.video-self').tubeplayer('volume', val);
  localStorage.setItem('volumeValue', val);
});

// Show music options.
var musicHover;
$('.music-icon, .music-options').hover(function() {
  clearTimeout(musicHover);
  $('.music-options').fadeIn();
}, function() {
  musicHover = setTimeout(function() {
    $('.music-options').fadeOut();
  }, 500);
});

// Music options.
$('.music-icon').on('click', function() {
  if($(this).hasClass('active')) {
    localStorage.setItem('volume', 'off');
    $(this).removeClass('active');
    $(".video-self").tubeplayer('mute');
  } else {
    localStorage.setItem('volume', 'on');
    $(this).addClass('active');
    $(".video-self").tubeplayer('unmute');
  }
});