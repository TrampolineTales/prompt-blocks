$(function(){
  var $titleInput = $('#title-input');
  var $titleLabel = $('#title-label');
  var $descriptionInput = $('#description-input');
  var $descriptionLabel = $('#description-label');

  $titleInput.on('keyup', UpdateTitleLabel);
  $descriptionInput.on('keyup', UpdateDescriptionLabel);

  function UpdateTitleLabel() {
    $titleLabel.text('Title (' + $titleInput.val().length + '/140):');
    if ($titleInput.val().length > 140) {
      $titleLabel.css('color', 'red');
    } else {
      $titleLabel.css('color', 'black');
    }
  }

  function UpdateDescriptionLabel() {
    $descriptionLabel.text('Description (' + $descriptionInput.val().length + '/500):');
    if ($descriptionInput.val().length > 500) {
      $descriptionLabel.css('color', 'red');
    } else {
      $descriptionLabel.css('color', 'black');
    }
  }
});
