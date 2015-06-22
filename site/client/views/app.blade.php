<!doctype html>
<html>
  <head>

    <meta charset="utf-8">
    <meta name="csrf-token" class="token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Gwent Online</title>

    <link href="{{ url('favicon.ico') }}" rel="icon" type="image/x-icon">
    <link href="{{ url('assets/css/app.css') }}" rel="stylesheet">

  </head>
  <body class="{{ $section }}">

    @if(Auth::check() || Request::path() != '/')
      <component is="inner"></component>
    @else
      <component is="landing"></component>
    @endif

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="{{ url('assets/js/bundle.js') }}"></script>

  </body>
</html>