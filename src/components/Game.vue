<template>
  <div>
    <table>
      <tr>
        <th>Player</th>
        <th>#</th>
        <th></th>
        <th></th>
        <th></th>
        <th>Lives</th>
      </tr>
      <tr v-for="player in players" :key="player.name"
          v-bind:class="{
            'current-player': isCurrentPlayer(player),
            'dead-player': isPlayerRIP(player)
          }"
      >
        <td>{{player.name}}</td>
        <td>{{player.num}}</td>
        <td v-for="(_throw, index) in player.throws" :key="index">
          <input disabled v-model="_throw.value"
                 v-if="!isPlayerRIP(player)"
                 v-bind:class="{'current-throw': isCurrentThrow(player, index)}"/>
        </td>
        <td>
          {{player.lives}}
          <img src="@/assets//heart.png"
               v-if="player.recoveries === 1"
               alt="heart"
               style="width:10px; height:auto;">
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import { Engine } from '../engine';

  let players = [];
  let currentPlayerNum = 1;
  let currentThrow = 1;

  export default {
    name: 'HelloWorld',
    props: {
      players: Array
    },
    data() {
      return {
        engine: new Engine(this.players)
      }
    },
    methods: {
      isNextThrow: () => {
        const THROWS_NUM = 3;
        return currentThrow < THROWS_NUM;
      },
      isCurrentPlayer: (player) => {
        return currentPlayer().num === player.num;
      },
      isPlayerRIP: (player) => {
        return isPlayerRIP(player);
      },
      isCurrentThrow: (player, index) => {
        return player.num === currentPlayer().num && currentThrow === index + 1;
      }
    },
    created() {
      players = this.engine.players;
      let self = this;

      window.addEventListener('keydown', function (e) {
        if (numberPressed(e.keyCode)) {
          if (isNewThrowValueValid(getThrowValue() + e.key)) {
            setThrowValue(getThrowValue() + e.key);
          }
        }

        if (backSpacePressed(e.keyCode)) {
          //TODO: go back in the history
          setThrowValue('');
        }

        if (enterPressed(e.keyCode)) {
          applyCurrentThrow();
          if (!isGameOver()) {
            if (self.isNextThrow()) {
              startNextThrow();
            } else {
              finishCurrentPlayer();
              if (isNextPlayer()) {
                startNewPlayer();
              } else {
                startNewRound();
              }
            }
            self.$forceUpdate();
          } else {
            // TODO: remove listeners
            // alert winners or losers
            finishGame();
          }
        }
      });
    }
  }

  //TODO: move all function to methods?
  function isGameOver() {
    // game is over if there only one players having lives
    // all other players must have 0 lives and was_dead = true
    let alivePlayers = players.filter(player => !isPlayerRIP(player));
    //TODO consider all are dead
    return alivePlayers.length === 0 || alivePlayers.length === 1 && alivePlayers[0].lives > 0;
  }

  function finishGame() {
    let alive = alivePlayers();
    if(alive.length === 1) {
      alert(`Congrats ${alive.name}!`);
    } else if(alive.length === 0) {
      alert(`It is so exiting you guys killed all each other!`);
    }
  }

  function startNewRound() {
    // should be first player is not out
    currentPlayerNum = 1;
    while(isPlayerRIP(getPlayerByOrder(currentPlayerNum))) {
      currentPlayerNum++;
    }
    currentThrow = 1;
    resetThrows();
  }

  function finishCurrentPlayer() {
    if(!_isCurrentPlayerAlive()) {
      currentPlayer().rip = true;
    }

    function _isCurrentPlayerAlive() {
      return currentPlayer().lives > 0;
    }
  }

  function startNextThrow() {
    currentThrow++;
  }

  function alivePlayers() {
    return players.filter(player => !isPlayerRIP(player));
  }

  function resetThrows() {
    players.forEach((player) => player.throws = [{value: ''}, {value: ''}, {value: ''}]);
  }

  function applyCurrentThrow() {
    let damagedPlayer = players.find(player => player.num === _getKilledPlayer());

    if (damagedPlayer) {
      if (currentPlayer().num !== damagedPlayer.num) {
        _damagePlayer(damagedPlayer, 1);
      } else {
        _healPlayer(currentPlayer(), 1);
      }
    }

    function _getKilledPlayer() {
      if (!isNaN(getThrowValue())) {
        return getThrowValue();
      }
    }

    function _damagePlayer(player, damage){
      if(!isPlayerRIP(player)) {
        let newLives = player.lives - damage > 0 ? player.lives - damage : 0;
        if(player.lives > 0) {
          if(newLives === 0) {
            if(player.recoveries === 0) {
              player.rip = true;
              alert(`${player.name} ----- RIP2`);
            } else {
              player.recoveries--;
            }
          }
          player.lives = newLives;
        }
      }
    }

    function _healPlayer(player, points) {
      if(!isPlayerRIP(player)) {
        player.lives = player.lives + points > 3 ? 3 : player.lives + points;
      }
    }
  }

  function startNewPlayer() {
    while(isPlayerRIP(getPlayerByOrder(currentPlayerNum++))) {
      if(currentPlayerNum > players.length) currentPlayerNum = 1;
    }
    currentThrow = 1;
  }

  function isPlayerRIP(player) {
    return player.rip;
  }

  function currentPlayer() {
    return players[currentPlayerNum - 1];
  }

  function getPlayerByOrder(order) {
    return players[order - 1];
  }

  function isNextPlayer() {
    let currentNumber = currentPlayerNum;
    while(++currentNumber <= players.length) {
      if(!isPlayerRIP(getPlayerByOrder(currentNumber))){
        return true;
      }
    }
    return false;
  }

  function setThrowValue(throwValue) {
    currentPlayer().throws[currentThrow - 1].value = throwValue;
  }

  function getThrowValue() {
    return currentPlayer().throws[currentThrow - 1].value;
  }

  function isNewThrowValueValid(newValue) {
    const VALID_SCORES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '25'];
    return VALID_SCORES.indexOf(newValue) !== -1;
  }

  function enterPressed(keyCode) {
    return keyCode === 13;
  }

  function backSpacePressed(keyCode) {
    return keyCode === 8;
  }

  function numberPressed(keyCode) {
    return (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105);
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  .current-throw {
    background-color: cornflowerblue;
  }

  .current-player {
    background-color: aquamarine;
  }

  .dead-player {
    background-color: red;
  }
</style>
