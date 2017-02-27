<template>
  <div id="app">
    <transpile></transpile>
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
  import Transpile from './components/Transpile.vue'

  export default {
    components: { Transpile },
    name: 'app'
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    background: #1e1e1e;
    height: 100%;
  }
  body {
    margin: 0;
    display: block;
    height: 100%;
    position: absolute; 
    top:0; 
    bottom:0; 
    right:0; 
    left:0;
  }
  html {
    min-height: 100%;
  }
</style>
