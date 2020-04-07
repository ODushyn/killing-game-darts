export default {
  source: localStorage,
  getAll() {
    if (!localStorage.getItem('availablePlayers')) {
      localStorage.setItem('availablePlayers', JSON.stringify(
        [
          {name: 'Sasha', num: ''},
          {name: 'Felipe', num: ''},
          {name: 'Oliver', num: ''},
          {name: 'Pilue', num: ''},
          {name: 'Artem', num: ''},
          {name: 'Jan', num: ''},
          {name: 'Fabricio', num: ''},
          {name: 'Paulo', num: ''},
          {name: 'Carlos', num: ''},
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