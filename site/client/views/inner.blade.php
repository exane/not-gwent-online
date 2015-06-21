@extends('app')

@section('content')

  @if($type == 'server')
    <component is="lobby" v-transition transition-mode="out-in"></component>
  @else
    <component is="@{{ view }}" v-transition transition-mode="out-in"></component>
  @endif

@stop