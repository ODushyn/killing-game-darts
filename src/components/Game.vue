<template>
  <div class="container">
    <table>
      <tr>
        <th>Player</th>
        <th>#</th>
        <th></th>
        <th></th>
        <th></th>
        <th style="text-align: center">Lives</th>
      </tr>
      <tr v-for="player in this.engine.players" :key="player.name"
          v-bind:class="{
            'current-player': (winner() !== undefined) && (winner() !== null) && isCurrentPlayer(player)
          }"
      >
        <td style="text-align: left">{{player.name}}</td>
        <td>{{player.num}}</td>
        <td v-for="(_throw, index) in player.throws" :key="index">
          <input disabled v-model="_throw.value"
                 v-if="!isPlayerRIP(player)"
                 v-bind:style="{width: 40 + 'px', 'text-align': 'center'}"
                 v-bind:class="{'current-throw': !winner() && isCurrentThrow(player, index)}"/>
        </td>
        <td style="text-align: center">
          <span v-if="!winner() && !player.rip">{{player.lives}}</span>
          <img src="@/assets/winner-cup.jpg"
               v-if="winner() && winner().num === player.num"
               alt="RIP"
               style="width:30px; height:auto;">
          <img src="@/assets/rip.svg"
               v-if="player.rip"
               alt="RIP"
               style="width:30px; height:auto;">
          <img src="@/assets/heart.png"
               v-if="!winner() && player.recoveries === 1"
               alt="heart"
               style="width:10px; height:auto;">
        </td>
      </tr>
    </table>
    <div v-if="winner()">
      <b> {{winner().name}}</b> is the best killer today!
    </div>
    <div v-if="winner() === undefined">
      <b> Good game dead guys! </b>
    </div>
    <div class="actions">
      <button v-on:click="$emit('restartGame')"
              class="restart-button">
        Restart
      </button>
      <button v-on:click="$emit('startNewGame')"
              class="new-game-button">
        New game
      </button>
    </div>
  </div>
</template>

<script>
  import {Engine} from '../engine';

  export default {
    name: 'Game',
    props: {
      players: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        engine: new Engine(this.players)
      }
    },
    methods: {
      isCurrentPlayer(player) {
        return this.engine.isCurrentPlayer(player);
      },
      isPlayerRIP(player) {
        return this.engine.isPlayerRIP(player);
      },
      isCurrentThrow(player, throwNum) {
        return this.engine.isCurrentThrow(player, throwNum);
      },
      winner() {
        return this.engine.winner
      }
    },
    created() {
      let self = this;
      let engine = self.engine;

      window.addEventListener('keydown', function (e) {
        if (numberPressed(e.keyCode) || enterPressed(e.keyCode)) {
          engine.setThrowValue(e.key);
        }

        if (backSpacePressed(e.keyCode)) {
          //TODO: go back in the history
          engine.revertLastAction();
        }

        if (enterPressed(e.keyCode)) {
          engine.processThrow();
        }
        self.$forceUpdate();
      });
    }
  }

  function enterPressed(keyCode) {
    return keyCode === 13;
  }

  function backSpacePressed(keyCode) {
    return keyCode === 8;
  }

  function numberPressed(keyCode) {
    return (keyCode >= 48 && keyCode <= 57) ||
      (keyCode >= 96 && keyCode <= 105) ||
      keyCode === 107 || keyCode === 110;
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .current-throw {
    background-color: cornflowerblue;
  }

  .current-player {
    background-color: aquamarine;
  }

  .actions {
    display: flex;
    margin-top: 3%;
  }
  .restart-button {
    margin-right: 8%;
    height: 25px;
    width: 100px;
  }

  .new-game-button {
    height: 25px;
    width: 100px;
  }
</style>
