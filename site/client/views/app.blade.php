<!doctype html>
<html>
  <head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Gwent Online</title>

    <link href="{{ url('favicon.ico') }}" rel="icon" type="image/x-icon">
    <link href="{{ url('assets/css/app.css') }}" rel="stylesheet">

  </head>
  <body class="{{ $section }}">

    @yield('content')

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="{{ url('assets/js/app.js') }}"></script>

    <script>
      $('.container-form-landing').addClass('active');
    </script>

  </body>
</html>