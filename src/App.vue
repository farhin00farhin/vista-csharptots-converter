<template>
  <div id="app">
    <transpile></transpile>
    <router-view></router-view>
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
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
