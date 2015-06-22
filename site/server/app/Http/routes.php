<?php

  get('/lobby', function() {
    return view('app')->withSection('inner');
  });

  get('/deck-builder', function() {
    return view('app')->withSection('inner');
  });

  get('/', function() {
    if(Auth::check()) {
      return redirect('/lobby');
    }

    return view('app')->withSection('landing');
  });