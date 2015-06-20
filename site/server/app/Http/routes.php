<?php

  get('/', function() {
    return view('tpl.landing')
      ->withSection('landing');
  });