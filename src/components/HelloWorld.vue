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
  //TODO: move to data
  let currentPlayerNum = 1;
  let currentThrow = 1;
  let players;

  export default {
    name: 'HelloWorld',
    props: {
      msg: String
    },
    data() {
      return {
        players: [
          {name: 'Felipe', num: '10', throws: [{value: ''}, {value: ''}, {value: ''}], recoveries: 1, lives: 3},
          {name: 'Sasha', num: '20', throws: [{value: ''}, {value: ''}, {value: ''}], recoveries: 1, lives: 3}
        ]
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
      let self = this;
      players = this.players;

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
          finishCurrentThrow();
          if (!isGameOver()) {
            if (self.isNextThrow()) {
              startNextThrow();
            } else if (isNextPlayer()) {
              startNewPlayer();
            } else {
              finishCurrentRound();
              startNewRound();
            }
            self.$forceUpdate();
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
    if(alivePlayers.length === 1) {
      alert(`${alivePlayers[0].name} ----- Congrats!`);
      return true;
    }

    return false;
  }

  function startNewRound() {
    currentPlayerNum = 1;
    currentThrow = 1;
    players.forEach((player) => player.throws = [{value: ''}, {value: ''}, {value: ''}]);
  }

  function finishCurrentRound() {
    if(currentPlayer().lives === 0) {
      currentPlayer().recoveries--;
    }
    if(isPlayerRIP(currentPlayer())){
      alert(`${currentPlayer().name} ----- RIP`)
    }
  }

  function startNextThrow() {
    currentThrow++;
  }

  function finishCurrentThrow() {
    let damagedPlayer = players.find(player => player.num === _getKilledPlayer());

    if (damagedPlayer && !isPlayerRIP(damagedPlayer)) {
      if(currentPlayer().num !== damagedPlayer.num) {
        if(damagedPlayer.lives > 0) damagedPlayer.lives--;
        if(damagedPlayer.lives === 0) damagedPlayer.recoveries--;
      } else {
        if(currentPlayer().lives < 3) currentPlayer().lives++;
      }
    }

    if (damagedPlayer && isPlayerRIP(damagedPlayer)) {
      alert(`${damagedPlayer.name} ----- RIP`)
    }

    function _getKilledPlayer() {
      if (!isNaN(getThrowValue())) {
        return getThrowValue();
      }
    }
  }

  function startNewPlayer() {
    currentPlayerNum += 1;
    currentThrow = 1;
  }

  function isPlayerRIP(player) {
    return player.lives === 0 && player.recoveries === -1;
  }

  function currentPlayer() {
    return players[currentPlayerNum - 1];
  }

  function isNextPlayer() {
    return currentPlayerNum < players.length;
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
