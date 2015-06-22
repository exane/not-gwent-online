<?php

  get('/lobby', function() {
    return view('app')
      ->withSection('inner');
  });

  get('/', function() {
    return view('app')
      ->withSection('landing');
  });