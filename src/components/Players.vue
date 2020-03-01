<template>
  <div class="container">
    <div class="settings">
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
        Num: <input v-model="player.num" v-on:change="numChange($event.target.value)"
                    v-bind:style="{width: 40 + 'px', 'text-align': 'center'}"/>
      </div>

      <button v-on:click="$emit('startGame', players)"
              class="start-button">
        Start game
      </button>
    </div>

    <div id="dartboard" style="width: 400px; height: 400px; margin-left: 3%"></div>
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
      },
      numChange(value) {
        console.log(value);
        const VALID_VALUES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
        if (VALID_VALUES.indexOf(value) !== -1) {
          document.querySelector(`.c-Dartboard-bed.c-Dartboard-outerSingle--${value}`).style.fill = 'yellow';
          document.querySelector(`.c-Dartboard-bed.c-Dartboard-innerSingle--${value}`).style.fill = 'yellow';
          document.querySelector(`.c-Dartboard-bed.c-Dartboard-triple--${value}`).style.fill = 'yellow';
          document.querySelector(`.c-Dartboard-bed.c-Dartboard-double--${value}`).style.fill = 'yellow';
        } else console.log('invalid');
      }
    },
    mounted() {
      // eslint-disable-next-line no-undef
      var dartboard = new Dartboard('#dartboard');
      dartboard.render();

      document.querySelector('#dartboard').addEventListener('throw', function (d) {
        console.log(d.detail);
      });
    }
  }
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .settings {
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