<template>
  <div id="app">
    <Players v-if="!gameStarted"
             v-bind:players="players"
             v-on:startGame="startGame($event)">
    </Players>
    <Game v-if="gameStarted"
          v-bind:players="players"
          v-on:restartGame="restartGame($event)"
          v-on:startNewGame="createNewGame($event)">
    </Game>
  </div>
</template>

<script>
  import Players from "./components/Players";
  import Game from "./components/Game";

  export default {
    name: 'App',
    components: {
      Game,
      Players
    },
    data() {
      return {
        gameStarted: JSON.parse(localStorage.getItem('gameStarted')) === true,
        players: undefined
      }
    },
    methods: {
      startGame(players) {
        this.players = players;
        this.gameStarted = true;
        localStorage.setItem('players', JSON.stringify(players));
        localStorage.setItem('gameStarted', 'true');
      },
      restartGame() {
        console.log('restart game');
        this.players = JSON.parse(localStorage.getItem('players'));
        this.gameStarted = false;
        localStorage.setItem('gameStarted', 'false');
      },
      createNewGame() {
        this.players = undefined;
        this.gameStarted = false;
        localStorage.setItem('gameStarted', 'false');
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
    margin-left: 60px;
  }
</style>
