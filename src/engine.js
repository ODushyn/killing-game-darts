const THROWS_NUM = 3;

export class Engine {
  players = [];
  currentPlayerNum = 1;
  currentThrow = 1;

  constructor(players) {
    this.players = players;
  }

  isNextThrow() {
    return this.currentThrow < THROWS_NUM;
  }

  getThrowValue() {
    return this.currentPlayer().throws[this.currentThrow - 1].value;
  }

  setThrowValue(value) {
    if (this.isNewThrowValueValid(this.getThrowValue() + value)) {
      this.currentPlayer().throws[this.currentThrow - 1].value = this.getThrowValue() + value;
    }
  }

  isCurrentPlayer(player) {
    return this.currentPlayer().num === player.num;
  }

  isCurrentThrow(player, throwNum) {
    return this.isCurrentPlayer(player) && this.currentThrow === throwNum + 1;
  }

  clearThrowValue() {
    this.currentPlayer().throws[this.currentThrow - 1].value = '';
  }

  applyCurrentThrow() {
    let that = this;
    let damagedPlayer = this.players.find(player => player.num === _getKilledPlayer());

    if (damagedPlayer) {
      if (this.currentPlayer().num !== damagedPlayer.num) {
        _damagePlayer(damagedPlayer, 1);
      } else {
        _healPlayer(this.currentPlayer(), 1);
      }
    }

    function _getKilledPlayer() {
      if (!isNaN(that.getThrowValue())) {
        return that.getThrowValue();
      }
    }

    function _damagePlayer(player, damage){
      if(!that.isPlayerRIP(player)) {
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
      if(!that.isPlayerRIP(player)) {
        player.lives = player.lives + points > 3 ? 3 : player.lives + points;
      }
    }
  }

  isGameOver() {
    // game is over if there only one players having lives
    // all other players must have 0 lives and was_dead = true
    let alivePlayers = this.players.filter(player => !this.isPlayerRIP(player));
    //TODO consider all are dead
    return alivePlayers.length === 0 || alivePlayers.length === 1 && alivePlayers[0].lives > 0;
  }

  startNextThrow() {
    this.currentThrow++;
  }

  finishCurrentPlayer() {
    let that = this;
    if(!_isCurrentPlayerAlive()) {
      this.currentPlayer().rip = true;
    }

    function _isCurrentPlayerAlive() {
      return that.currentPlayer().lives > 0;
    }
  }

  isNextPlayer() {
    let currentNumber = this.currentPlayerNum;
    while(++currentNumber <= this.players.length) {
      if(!this.isPlayerRIP(this.getPlayerByOrder(currentNumber))){
        return true;
      }
    }
    return false;
  }

  startNewPlayer() {
    while(this.isPlayerRIP(this.getPlayerByOrder(this.currentPlayerNum++))) {
      if(this.currentPlayerNum > this.players.length) this.currentPlayerNum = 1;
    }
    this.currentThrow = 1;
  }

  startNewRound() {
    // should be first player is not out
    this.currentPlayerNum = 1;
    while(this.isPlayerRIP(this.getPlayerByOrder(this.currentPlayerNum))) {
      this.currentPlayerNum++;
    }
    this.currentThrow = 1;
    this.resetThrows();
  }

  finishGame() {
    let alive = this.getAlivePlayers();
    if(alive.length === 1) {
      alert(`Congrats ${alive.name}!`);
    } else if(alive.length === 0) {
      alert(`It is so exiting you guys killed all each other!`);
    }
  }

  isPlayerRIP(player) {
    return player.rip;
  }


  // make private?
  resetThrows() {
    this.players.forEach((player) => player.throws = [{value: ''}, {value: ''}, {value: ''}]);
  }

  getAlivePlayers() {
    return this.players.filter(player => !this.isPlayerRIP(player));
  }

  getPlayerByOrder(order) {
    return this.players[order - 1];
  }

  isNewThrowValueValid(newValue) {
    const VALID_SCORES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '25'];
    return VALID_SCORES.indexOf(newValue) !== -1;
  }

  currentPlayer() {
    return this.players[this.currentPlayerNum - 1];
  }
}