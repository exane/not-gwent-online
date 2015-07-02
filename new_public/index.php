<!doctype html>
<html>
<head>

  <meta charset="utf-8">
  <title>Gwent Online</title>

  <link href="assets/favicon.ico" rel="icon" type="image/x-icon">

  <link href="css/core.css" rel="stylesheet">
  <link href="../public/build/cards.css" rel="stylesheet">
  <link href="css/board.css" rel="stylesheet">
  <link href="css/hand.css" rel="stylesheet">
  <link href="css/leader.css" rel="stylesheet">

</head>
<body>

  <div class="hand-wrap">
    <div class="wrap">

      <?php

        require 'partials/leader.php';
        require 'partials/hand_cards.php';
        require 'partials/sub_hand.php';

      ?>

    </div>
  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
  <script src="core.js"></script>

  <script>

    // Count hand cards and set correct width.
    // todo: Run on update.
    //var handLength = $('.card').length * 70;
    //$('.hand-cards').css('width', handLength + 'px');


  </script>

</body>
</html>