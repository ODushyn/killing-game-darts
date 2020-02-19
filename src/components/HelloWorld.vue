<template>
  <div>
    <table>
      <tr>
        <th>Player</th>
        <th>#</th>
        <th>1st</th>
        <th>2nd</th>
        <th>3rd</th>
        <th>Lives</th>
      </tr>
      <tr v-for="player in players" :key="player.name">
        <td>{{player.name}}</td>
        <td>{{player.num}}</td>
        <td v-for="(_throw, index) in player.throws" :key="index">
          <input disabled v-model="_throw.value"/>
        </td>
        <td> {{player.lives}}</td>
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
          {name: 'Felipe', num: '10', throws: [{value: ''}, {value: ''}, {value: ''}], lives: 3},
          {name: 'Sasha', num: '20', throws: [{value: ''}, {value: ''}, {value: ''}], lives: 3}
        ]
      }
    },
    methods: {
      isNextThrow: () => {
        const THROWS_NUM = 3;
        return currentThrow < THROWS_NUM;
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
          if(self.isNextThrow()) {
            startNextThrow();
          } else if(isNextPlayer()) {
            startNewPlayer();
          } else {
            startNewRound();
          }
        }
      });
    }
  }

  //TODO: move all function to methods
  function startNewRound() {
    currentPlayerNum = 1;
    currentThrow = 1;
    players.forEach((player) => player.throws = [{value: ''}, {value: ''}, {value: ''}]);
  }

  function startNextThrow() {
    currentThrow++;
  }

  // function isNextThrow() {
  //   const THROWS_NUM = 3;
  //   return currentThrow < THROWS_NUM;
  // }

  function startNewPlayer() {
    currentPlayerNum += 1;
    currentThrow = 1;
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

  a {
    color: #42b983;
  }
</style>
