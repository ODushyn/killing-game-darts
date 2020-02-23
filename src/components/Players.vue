<template>
<template>
  <div>
    <button v-on:click="$emit('startGame', players)">Start game</button>
    <div v-for="(player, index) in this.players" :key="index">
      <button v-on:click="deletePlayer(index)">Delete player</button>
      Name: <input v-model="player.name"/>
      Num: <input v-model="player.num" v-bind:style="{width: 40 + 'px', 'text-align': 'center'}"/>
    </div>
    <button v-on:click="addPlayer">Add player</button>
  </div>
</template>

<script>

  export default {
    name: 'Players',
    props: {
      players: {
        type: Array,
        default: function() {
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
</style>