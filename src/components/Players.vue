<template>
  <div class="container">
    <div v-for="(player, index) in this.players" :key="index">
      <button v-on:click="deletePlayer(index)">
        Delete player
      </button>
      Name: <input v-model="player.name"/>
      Num: <input v-model="player.num" v-bind:style="{width: 40 + 'px', 'text-align': 'center'}"/>
    </div>

    <button v-on:click="addPlayer"
            class="add-player-button">
      Add player
    </button>

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

  .add-player-button {
    margin-top: 1%;
  }
</style>