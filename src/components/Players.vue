<template>
  <div class="container">
    <div class="settings">
      <!--      <div class="player-action-buttons">-->
      <!--        <button v-on:click="addPlayer">-->
      <!--          Add-->
      <!--        </button>-->
      <!--        <button v-if="players.length > 1" v-on:click="rotate">-->
      <!--          Rotate-->
      <!--        </button>-->
      <!--      </div>-->
      <div class="selected_players">
        <div v-if="selectedPlayers.length > 0">Select a player and assign the number from the dartboard</div>
        <div v-for="(player, index) in this.selectedPlayers" :key="index" class="player-row">
          <button class="remove-selected-cross" v-on:click="removeSelectedPlayer(player)">
            X
          </button>
          <input type="radio"
                 :id="'selected' + player.name"
                 name="selected_player_group"
                 v-bind:style="{'display': 'none'}"
                 v-on:click="setSelectedPlayer(player)">
          <label class="player-label" :for="'selected' + player.name">{{player.name}}</label>

          <input v-model="player.num"
                 v-bind:class="{'highlight-selected-player': selectedPlayer.name === player.name}"
                 v-bind:style="{width: 40 + 'px', 'text-align': 'center'}" disabled/>
        </div>
        <div v-if="selectedPlayers.length === 0">Select players to start the game</div>
      </div>

      <div class="available_players">
        <div v-for="(player, index) in this.players" :key="index" class="player-row">
          <input type="radio"
                 :id="'available' + player.name"
                 name="available_player_group"
                 v-bind:style="{'display': 'none'}" v-on:click="addToSetup(player)">
          <label class="player-label" :for="'available' + player.name">
            {{player.name}} <span class="remove-available-cross" v-on:click="removePlayer($event, player)">X</span>
          </label>
        </div>
        <div class="player-row">
          <input v-model="newAvailablePlayer" class="add-available-player-input">
          <button v-on:click="addAvailablePlayer()">Add</button>
        </div>
      </div>

      <button v-on:click="$emit('startGame', selectedPlayers)"
              :disabled="selectedPlayers.length < 2 || selectedPlayers.find(p => !p.num)"
              class="start-button">
        Start game
      </button>
    </div>

    <div id="dartboard" style="width: 50%; min-width: 300px; min-height: 300px; margin-left: 3%"></div>
  </div>
</template>

<script>
  import playersAPI from '../availablePlayers';

  export default {
    name: 'Players',
    props: {
      players: {
        type: Array,
        default: function () {
          return playersAPI.getAll();
        }
      }
    },
    data() {
      return {
        selectedPlayers: [],
        selectedPlayer: {},
        newAvailablePlayer: ''
      }
    },
    methods: {
      addPlayer() {
        this.players.push({name: '', num: ''});
      },
      rotate() {
        this.players.reverse();
      },
      addAvailablePlayer() {
        if (!_playerAlreadyExist(this.players, this.newAvailablePlayer)) {
          this.players.push({name: this.newAvailablePlayer, num: ''});
          playersAPI.save({name: this.newAvailablePlayer, num: ''});
          this.newAvailablePlayer = '';
          this._sortPlayers(this.players);
        }

        function _playerAlreadyExist(players, name) {
          if(!name) return false;
          return !!players.find(p => p.name === name);
        }
      },
      addToSetup(player) {
        this.selectedPlayers.push(player);
        this.players = this.players.filter(p => p.name !== player.name);
      },
      removeSelectedPlayer(player) {
        if (player.name === this.selectedPlayer.name) {
          this.selectedPlayer = {};
        }
        this.selectedPlayers = this.selectedPlayers.filter(p => p.name !== player.name);
        this._unhighlight(+player.num);

        this.players.push(player);
        this._sortPlayers(this.players);
      },
      setSelectedPlayer(player) {
        this.selectedPlayer = player;
      },
      removePlayer(event, player) {
        this.players = this.players.filter(p => p.name !== player.name);
        playersAPI.remove(player);
        event.stopPropagation();
        event.preventDefault();
      },
      _sortPlayers(players) {
        players.sort((a, b) => (a.name > b.name) ? 1 : -1)
      },
      _highlight(bed) {
        document.querySelector(`.c-Dartboard-bed.c-Dartboard-outerSingle--${bed}`).style.fill = 'yellow';
        document.querySelector(`.c-Dartboard-bed.c-Dartboard-innerSingle--${bed}`).style.fill = 'yellow';
        document.querySelector(`.c-Dartboard-bed.c-Dartboard-triple--${bed}`).style.fill = 'yellow';
        document.querySelector(`.c-Dartboard-bed.c-Dartboard-double--${bed}`).style.fill = 'yellow';
      },
      _unhighlight(bed) {
        const BLACK_RED = [2, 3, 7, 8, 14, 12, 20, 18, 13, 10];
        const WHITE_GREEN = [1, 4, 6, 15, 17, 19, 16, 11, 9, 5];
        if (BLACK_RED.indexOf(bed) !== -1) {
          document.querySelector(`.c-Dartboard-bed.c-Dartboard-outerSingle--${bed}`).style.fill = 'black';
          document.querySelector(`.c-Dartboard-bed.c-Dartboard-innerSingle--${bed}`).style.fill = 'black';
          document.querySelector(`.c-Dartboard-bed.c-Dartboard-triple--${bed}`).style.fill = 'red';
          document.querySelector(`.c-Dartboard-bed.c-Dartboard-double--${bed}`).style.fill = 'red';
        } else if (WHITE_GREEN.indexOf(bed) !== -1) {
          document.querySelector(`.c-Dartboard-bed.c-Dartboard-outerSingle--${bed}`).style.fill = 'ivory';
          document.querySelector(`.c-Dartboard-bed.c-Dartboard-innerSingle--${bed}`).style.fill = 'ivory';
          document.querySelector(`.c-Dartboard-bed.c-Dartboard-triple--${bed}`).style.fill = 'green';
          document.querySelector(`.c-Dartboard-bed.c-Dartboard-double--${bed}`).style.fill = 'green';
        }
      }
    },
    created() {
      this._sortPlayers(this.players);
    },
    mounted() {
      // eslint-disable-next-line no-undef
      const dartboard = new Dartboard('#dartboard');
      dartboard.render();

      const that = this;
      document.querySelector('#dartboard').addEventListener('throw', function (d) {
        let bed = d.detail.bed;
        if (['B25', 'DB50'].indexOf(bed) !== -1) return;
        if (!that.selectedPlayers.length || !that.selectedPlayer.name) return;

        bed = bed.slice(1);

        if (that.selectedPlayers.find(player => player.num === bed)) {
          that.selectedPlayers.forEach(player => {
            if (player.num === bed) {
              player.num = '';
            }
          })
        }
        if (that.selectedPlayer.num !== bed) {
          that._unhighlight(+that.selectedPlayer.num);
          that._highlight(+bed);
        } else {
          that._highlight(+bed);
        }
        that.selectedPlayer.num = bed;
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    width: 50%;
  }

  .player-row {
    display: flex;
    margin-top: 1%;
  }

  .remove-available-cross {
    color: darkred;
    cursor: url("https://i.stack.imgur.com/bUGV0.png"), auto;
  }

  .remove-selected-cross:focus {
    outline: none;
  }

  .highlight-selected-player {
    background-color: cornflowerblue;
  }

  .remove-selected-cross {
    color: darkred;
    border: 0;
    background: none;
    box-shadow: none;
    border-radius: 0;
  }

  /* Available players */

  .available_players {
    display: flex;
    flex-direction: row;
    flex-flow: wrap;
    justify-content: flex-start;
  }

  .available_players .player-row {
    margin-right: 1%;
    font-size: 10px;
  }

  .available_players .player-row .player-label {
    width: fit-content;
    background-color: #bbf;
  }

  .add-available-player-input {
    width: 100px;
  }

  /* ---------------- */

  /* Selected players */

  .selected_players {
    display: flex;
    flex-direction: column;
    margin-bottom: 15%;
  }

  .selected_players .player-row {
    margin-top: 2%;
  }

  .selected_players .player-row .player-label {
    margin-right: 3%;
  }

  .selected_players .player-row .player-label:hover {
    background-color: cornflowerblue;
  }

  .selected_players .player-row input[type="radio"]:checked + label {
    background-color: cornflowerblue;
  }

  /* ----------------*/


  .start-button {
    margin-top: 5%;
    height: 40px;
  }

  .player-action-buttons {
    display: flex;
    width: 110%;
    margin-bottom: 2%;
  }

  .player-action-buttons button {
    margin-right: 1%;
    width: 20%;
  }

  .player-label {
    width: 150px;
    padding: 5px 5px 5px 5px;
    border: 1px solid #666;
    color: #000;
    text-decoration: none;
    background-color: #bbb;
    display: inline-block;
    border-radius: 2px;
  }
</style>