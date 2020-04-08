<template>
  <div id="app">
    <h2>Killing Game</h2>

    <Players v-if="!gameStarted"
             v-bind:selected-players="selectedPlayers"
             v-on:startGame="startGame($event)">
    </Players>
    <Game v-if="gameStarted"
          v-bind:players="selectedPlayers"
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
        selectedPlayers: undefined
      }
    },
    methods: {
      startGame(selectedPlayers) {
        this.selectedPlayers = selectedPlayers;
        this.gameStarted = true;
        localStorage.setItem('gameStarted', 'true');
      },
      createNewGame(selectedPlayers) {
        this.selectedPlayers = selectedPlayers;
        this.selectedPlayers.forEach(p => p.num = '');
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
    margin-left: 60px;
    zoom: 150%;
  }
</style>
