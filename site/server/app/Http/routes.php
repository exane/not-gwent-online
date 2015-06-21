<?php

  get('/lobby', function() {
    return view('inner')
      ->withSection('inner')
      ->withType('server');
  });

  get('/', function() {
    if(Auth::check()) {
      return redirect('/lobby');
    }

    return view('landing')
      ->withSection('landing');
  });