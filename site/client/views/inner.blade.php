@extends('app')

@section('content')

  <section class="container-inner">

    @if($type == 'server')
      <component is="lobby" v-transition transition-mode="out-in"></component>
    @else
      <component is="@{{ view }}" v-transition transition-mode="out-in"></component>
    @endif

    <component is="chat"></component>

  </section>

@stop