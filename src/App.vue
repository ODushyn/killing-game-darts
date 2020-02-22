<template>
  <div id="app">
    <HelloWorld :players="players"/>
  </div>
</template>

<script>
  import HelloWorld from './components/Game.vue'

  export default {
    name: 'App',
    components: {
      HelloWorld
    },
    data() {
      return {
        players: [
          {
            name: 'Felipe',
            num: '10',
            throws: [{value: ''}, {value: ''}, {value: ''}],
            recoveries: 1,
            lives: 3,
            rip: false
          },
          {
            name: 'Oliver',
            num: '15',
            throws: [{value: ''}, {value: ''}, {value: ''}],
            recoveries: 1,
            lives: 3,
            rip: false
          },
          {
            name: 'Sasha',
            num: '20',
            throws: [{value: ''}, {value: ''}, {value: ''}],
            recoveries: 1,
            lives: 3,
            rip: false
          }
        ]
      }
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
