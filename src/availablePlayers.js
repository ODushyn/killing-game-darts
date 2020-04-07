export default {
  source: localStorage,
  getAll() {
    if (!localStorage.getItem('availablePlayers')) {
      localStorage.setItem('availablePlayers', JSON.stringify(
        [
          {name: 'Sashasashasasha', num: ''},
          {name: 'Felipe', num: ''},
          {name: 'Oliver', num: ''},
          {name: 'Pilue', num: ''},
          {name: 'Sashasashasasha1', num: ''},
          {name: 'Felipe1', num: ''},
          {name: 'Oliver1', num: ''},
          {name: 'Pilue1', num: ''},
          {name: 'Sashasashasasha1', num: ''},
          {name: 'Felipe1', num: ''},
          {name: 'Oliver1', num: ''},
          {name: 'Pilue1', num: ''}
        ])
      )
    }
    return JSON.parse(localStorage.getItem('availablePlayers'));
  },
  save(player) {
    if (!localStorage.getItem('availablePlayers')) {
      localStorage.setItem('availablePlayers', JSON.stringify([player]));
    } else {
      let players = JSON.parse(localStorage.getItem('availablePlayers'));
      players.push(player);
      localStorage.setItem('availablePlayers', JSON.stringify(players));
    }
  },
  remove(player) {
    if (localStorage.getItem('availablePlayers')) {
      let players = JSON.parse(localStorage.getItem('availablePlayers'));
      players = players.filter(p => p.name !== player.name);
      localStorage.setItem('availablePlayers', JSON.stringify(players));
    }
  }
}