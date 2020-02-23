<template>
  <div class="container">
    <div class="player-action-buttons">
      <button v-on:click="addPlayer">
        Add
      </button>
      <button v-if="players.length > 1" v-on:click="rotate">
        Rotate
      </button>
    </div>

    <div v-for="(player, index) in this.players" :key="index" class="player-row">
      <button v-on:click="deletePlayer(index)">
        Delete
      </button>
      Name: <input v-model="player.name"/>
      Num: <input v-model="player.num" v-bind:style="{width: 40 + 'px', 'text-align': 'center'}"/>
    </div>

    <button v-on:click="$emit('startGame', players)"
            class="start-button">
      Start game
    </button>
  </div>
</template>

<script>
  export default {
    name: 'Players',
    props: {
      players: {
        type: Array,
        default: function () {
          return [{name: '', num: ''}];
        }
      }
    },
    methods: {
      addPlayer() {
        this.players.push({name: '', num: ''});
      },
      deletePlayer(index) {
        this.players.splice(index, 1);
      },
      rotate() {
        this.players.reverse();
      }
    }
  }
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .start-button {
    margin-top: 3%;
    height: 40px;
    color: green;
  }

  .player-action-buttons {
    display: flex;
    width: 110%;
    margin-bottom: 2%;
  }

  .player-action-buttons button {
    margin-right: 1%;
    width: 7%;
  }

  .player-row {
    margin-top: 1%;
  }


</style>