$(function(){
  var $promptblocks = $('.promptblock');
  if ($promptblocks.length % 3 == 1) { //One extra
    $promptblocks[$promptblocks.length - 1].style.marginLeft = '250px';
    $promptblocks[$promptblocks.length - 1].style.marginRight = '250px';
  }

  if ($promptblocks.length % 3 == 2) { //Two extra
    $promptblocks[$promptblocks.length - 1].style.marginRight = '125px';
    $promptblocks[$promptblocks.length - 2].style.marginLeft = '125px';
  }
});
