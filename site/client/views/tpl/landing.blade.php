@extends('app')

@section('content')

    @include('partials.modals.login')

    <section class="container-landing">
      <div class="wrap-landing">
        <img src="{{ url('assets/img/logo-big.png') }}" width="243" height="85" alt="Gwent" class="logo-big">

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
              <i class="icon-load"></i>
            </div>
          </form>

          <span class="choose">or</span>

          <a href="#" class="btn-second btn-guest">Play as guest</a>
          <a href="#" class="btn-none btn-login">Login</a>

        </div>
      </div>
    </section>

@stop