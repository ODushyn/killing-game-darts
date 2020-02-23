const THROWS_NUM = 3;

export class Engine {
  players = [];
  currentPlayerNum = 1;
  currentThrow = 1;
  winner = null;

  constructor(players) {
    if (players.length > 0) {
      this.players = players.map(p => Object.assign(p, {
        throws: [{value: ''}, {value: ''}, {value: ''}],
        recoveries: 1,
        lives: 3,
        rip: false
      }));
      this.clearHistory();
      this.addEventToHistory();
    } else {
      this.applyHistoryFromStorage();
      this.revertLastAction();
    }
  }

  processThrow() {
    this.addEventToHistory();
    this.applyCurrentThrow();
    if (!this.isGameOver()) {
      if (this.isNextThrow()) {
        this.startNextThrow();
      } else {
        this.finishCurrentPlayer();
        if (this.isNextPlayer()) {
          this.startNewPlayer();
        } else {
          this.startNewRound();
        }
      }
    }

    if (this.isGameOver()) {
      // alert winners or losers
      this.finishGame();
    }
  }

  isNextThrow() {
    return this.currentThrow < THROWS_NUM;
  }

  getThrowValue() {
    return this.currentPlayer().throws[this.currentThrow - 1].value;
  }

  setThrowValue(value) {
    if (this.isGameOver()) return;
    let that = this;
    this.currentPlayer().throws[this.currentThrow - 1].value = _generateThrowValue(value);

    function _generateThrowValue(value) {
      let throwValue = that.getThrowValue();
      if (throwValue === '' && value === 'Enter') {
        throwValue = 'Miss';
      } else if (value === '.' && that.isThrowValueValid(throwValue)) {
        if (throwValue !== '25') {
          throwValue = `T-${throwValue}`;
        }
      } else if (value === '+' && that.isThrowValueValid(throwValue)) {
        throwValue = `D-${throwValue}`;
      } else if (value === '+' && throwValue.startsWith('D-')) {
        throwValue = `T-${throwValue.split('-')[1]}`;
      } else {
        if (that.isThrowValueValid(throwValue + value)) {
          throwValue += value
        }
      }
      return throwValue;
    }
  }

  isCurrentPlayer(player) {
    return this.currentPlayer().num === player.num;
  }

  isCurrentThrow(player, throwNum) {
    return this.isCurrentPlayer(player) && this.currentThrow === throwNum + 1;
  }

  revertLastAction() {
    if (this.getThrowValue() !== '') {
      this.currentPlayer().throws[this.currentThrow - 1].value = '';
    } else {
      this.applyLastEventFromHistory();
    }
  }

  applyLastEventFromHistory() {
    let history = this.getHistory();
    let snapshot = history.length > 1 ? history.pop() : history[0];
    this.players = snapshot.players;
    this.currentPlayerNum = snapshot.currentPlayerNum;
    this.currentThrow = snapshot.currentThrow;
    this.winner = snapshot.winner;
    this.setHistory(history);
  }

  applyHistoryFromStorage() {
    this.applyLastEventFromHistory();
  }

  getHistory() {
    return JSON.parse(window.localStorage.getItem('history') || '[]');
  }

  setHistory(history) {
    window.localStorage.setItem('history', JSON.stringify(history));
  }

  clearHistory() {
    window.localStorage.removeItem('history');
  }

  addEventToHistory() {
    let event = JSON.parse(JSON.stringify(
      Object.assign({}, {
        players: this.players,
        currentPlayerNum: this.currentPlayerNum,
        currentThrow: this.currentThrow,
        winner: this.winner
      })
    ));
    let history = this.getHistory() || [];
    history.push(event);
    this.setHistory(history);
  }

  applyCurrentThrow() {
    let that = this;
    let damagedPlayer = this.players.find(player => player.num === _getKilledPlayer());

    if (damagedPlayer) {
      if (this.currentPlayer().num !== damagedPlayer.num) {
        _damagePlayer(damagedPlayer, _calculateDamage());
      } else {
        _healPlayer(this.currentPlayer(), _calculateDamage());
      }
    }

    function _getKilledPlayer() {
      if (!isNaN(that.getThrowValue())) {
        return that.getThrowValue();
      } else {
        //parse i.e. T-14 or D-13
        return that.getThrowValue().split('-')[1];
      }
    }

    function _calculateDamage() {
      if (that.getThrowValue().startsWith('T')) {
        return 3;
      } else if (that.getThrowValue().startsWith('D')) {
        return 2;
      }

      return 1;
    }

    function _damagePlayer(player, damage) {
      if (!that.isPlayerRIP(player)) {
        let newLives = player.lives - damage > 0 ? player.lives - damage : 0;
        if (player.lives > 0) {
          if (newLives === 0) {
            if (player.recoveries === 0) {
              player.rip = true;
            } else {
              player.recoveries--;
            }
          }
          player.lives = newLives;
        }
      }
    }

    function _healPlayer(player, points) {
      if (!that.isPlayerRIP(player)) {
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
    if (!_isCurrentPlayerAlive()) {
      this.currentPlayer().rip = true;
    }

    function _isCurrentPlayerAlive() {
      return that.currentPlayer().lives > 0;
    }
  }

  isNextPlayer() {
    let currentNumber = this.currentPlayerNum;
    while (++currentNumber <= this.players.length) {
      if (!this.isPlayerRIP(this.getPlayerByOrder(currentNumber))) {
        return true;
      }
    }
    return false;
  }

  startNewPlayer() {
    let index = 0;
    this.currentThrow = 1;
    while (index++ < this.players.length) {
      this.currentPlayerNum++;
      this.currentPlayerNum = this.currentPlayerNum > this.players.length ? 1 : this.currentPlayerNum;
      if (!this.isPlayerRIP(this.getPlayerByOrder(this.currentPlayerNum))) {
        return;
      }
    }
  }

  startNewRound() {
    // should be first player that is not RIP
    this.currentPlayerNum = 0;
    this.startNewPlayer();
    this.resetThrows();
  }

  finishGame() {
    let alive = this.getAlivePlayers();
    if (alive.length === 1) {
      this.winner = alive[0];
    } else if (alive.length === 0) {
      // everybody killed each other
      this.winner = undefined;
      //alert(`It is so exiting you guys killed all each other!`);
    }
  }

  isPlayerRIP(player) {
    return player.rip;
  }

  resetThrows() {
    this.players.forEach((player) => player.throws = [{value: ''}, {value: ''}, {value: ''}]);
  }

  getAlivePlayers() {
    return this.players.filter(player => !this.isPlayerRIP(player));
  }

  getPlayerByOrder(order) {
    return this.players[order - 1];
  }

  isThrowValueValid(newValue) {
    const VALID_SCORES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '25'];
    return VALID_SCORES.indexOf(newValue) !== -1;
  }

  currentPlayer() {
    return this.players[this.currentPlayerNum - 1];
  }
}