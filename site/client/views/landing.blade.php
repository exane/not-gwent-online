@extends('app')

@section('content')

  <login></login>

  <section class="container-landing">
    <div class="wrap-landing">
      <img src="assets/img/logo-big.png" width="243" height="85" alt="Gwent" class="logo-big">

      <p class="teaser-landing">
        Play The Witcher Gwent Card-Game online!<br>
        Play with randomly generated teams, or build your own!
      </p>

      <div class="container-form-landing">

        <form class="form-session">
          <input type="text" placeholder="Username" class="field-session" autofocus>
          <input type="password" placeholder="Password" class="field-session">

          <div class="wrap-btn-action btn-register-action">
            <input type="submit" value="Register" class="btn-action">
            <i class="icon-action-load"></i>
          </div>
        </form>

        <span class="choose">or</span>

        <a class="btn-second btn-guest">Play as guest <i class="icon-guest-load"></i></a>
        <a href="#" class="btn-none btn-login" v-on="click: modal = true">Login</a>

      </div>
    </div>
  </section>

@stop