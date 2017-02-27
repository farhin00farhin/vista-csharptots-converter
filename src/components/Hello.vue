<template>
  <div class="hello">
    <h4>by <a href="http://github.com/uni-projecao">uni-projecao</a></h4>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2, h3, h4 {
      font-weight: normal;
    }

    h4 {
        padding: 5px;
        color: #fff;
        margin: 0;
    }

    a {
      color: #42b983;
      text-decoration: none;
    }
</style>
