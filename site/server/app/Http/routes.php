<?php

  get('/lobby', function() {
    return innerView();
  });

  get('/deck-builder', function() {
    return innerView();
  });

  get('/highscore', function() {
    return innerView();
  });

  get('/', function() {
    if(Auth::check()) {
      return redirect('/lobby');
    }

    return view('app')->withSection('landing');
  });

  function innerView()
  {
    return view('app')->withSection('inner');
  }