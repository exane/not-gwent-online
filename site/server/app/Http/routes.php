<?php

  // todo: move to controllers
  use Gwent\User;
  use Illuminate\Support\Facades\Request;

  Route::group(['prefix' => 'api'], function() {

    post('/register', function() {
      $user = new User();
      $user->username = Request::input('username');
      $user->email = Request::input('email');
      $user->password = bcrypt(Request::input('password'));
      $user->save();

      Auth::login($user);
    });

  });

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