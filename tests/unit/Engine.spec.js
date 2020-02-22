import {expect} from 'chai';
import {Engine} from "../../src/engine";

describe('Game', () => {
  describe('unit tests', function () {
    let players = [];

    beforeEach(() => {
      players = [
        {
          name: 'Felipe',
          num: '10',
          throws: [{value: ''}, {value: ''}, {value: ''}],
          recoveries: 1,
          lives: 3,
          rip: false
        },
        {
          name: 'Oliver',
          num: '15',
          throws: [{value: ''}, {value: ''}, {value: ''}],
          recoveries: 1,
          lives: 0,
          rip: false
        },
        {
          name: 'Sasha',
          num: '20',
          throws: [{value: ''}, {value: ''}, {value: ''}],
          recoveries: 1,
          lives: 3,
          rip: false
        }
      ];
    });

    it('should skip RIP players in the middle', function () {
      let engine = new Engine(players);
      engine.players[1].rip = true;
      engine.currentPlayerNum = 1;
      engine.startNewPlayer();
      expect(engine.currentPlayer().num).to.equal('20');
    });

    it('should skip RIP players in the end', function () {
      let engine = new Engine(players);
      engine.players[2].rip = true;
      engine.currentPlayerNum = 1;
      engine.startNewPlayer();
      expect(engine.currentPlayer().num).to.equal('15');
      engine.startNewPlayer();
      expect(engine.currentPlayer().num).to.equal('10');
    });

    it('should skip RIP players in the beginning', function () {
      let engine = new Engine(players);
      engine.players[0].rip = true;
      engine.currentPlayerNum = 2;
      engine.startNewPlayer();
      expect(engine.currentPlayer().num).to.equal('20');
      engine.startNewPlayer();
      expect(engine.currentPlayer().num).to.equal('15');
    });

    it('should check if any player available in the round', () => {
      let engine = new Engine(players);
      engine.currentPlayerNum = 2;
      engine.setThrowValue('15');
      engine.processThrow();
      expect(engine.isNextPlayer()).to.equal(true);
    });

    it('should check if any player available in the round', () => {
      let engine = new Engine(players);
      engine.currentPlayerNum = 2;
      engine.setThrowValue('15');
      engine.processThrow();
      expect(engine.isNextPlayer()).to.equal(true);
    });

    it('should check if new player available in the round skipping RIP', function () {
      let engine = new Engine(players);
      engine.players[2].rip = true;
      engine.currentPlayerNum = 2;
      engine.setThrowValue('15');
      engine.processThrow();
      expect(engine.isNextPlayer()).to.equal(false);
    });

    it('should check if new player available in the round after last player', function () {
      let engine = new Engine(players);
      engine.currentPlayerNum = 3;
      engine.setThrowValue('15');
      engine.processThrow();
      expect(engine.isNextPlayer()).to.equal(false);
    });
  });

  describe('system test', () => {
    let players = [
      {
        name: 'Felipe',
        num: '10',
        throws: [{value: ''}, {value: ''}, {value: ''}],
        recoveries: 1,
        lives: 3,
        rip: false
      },
      {
        name: 'Oliver',
        num: '15',
        throws: [{value: ''}, {value: ''}, {value: ''}],
        recoveries: 1,
        lives: 3,
        rip: false
      },
      {
        name: 'Sasha',
        num: '20',
        throws: [{value: ''}, {value: ''}, {value: ''}],
        recoveries: 1,
        lives: 3,
        rip: false
      }
    ];
    let engine = new Engine(players);

    it('1st player 1st throw', function () {
      engine.setThrowValue('15');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(3);
      expect(engine.players[1].lives).to.equal(2);
      expect(engine.players[2].lives).to.equal(3);
    });

    it('1st player 2nd throw', function () {
      expect(engine.isNextThrow()).to.equal(true);
      engine.setThrowValue('20');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(3);
      expect(engine.players[1].lives).to.equal(2);
      expect(engine.players[2].lives).to.equal(2);
    });

    it('1st player 3nd throw', function () {
      expect(engine.isNextThrow()).to.equal(false);
      engine.setThrowValue('10');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(3);
      expect(engine.players[1].lives).to.equal(2);
      expect(engine.players[2].lives).to.equal(2);
    });

    it('2nd player 1st throw', function () {
      engine.setThrowValue('15');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(3);
      expect(engine.players[1].lives).to.equal(3);
      expect(engine.players[2].lives).to.equal(2);
    });

    it('2nd player 2nd throw', function () {
      expect(engine.isNextThrow()).to.equal(true);
      engine.setThrowValue('15');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(3);
      expect(engine.players[1].lives).to.equal(3);
      expect(engine.players[2].lives).to.equal(2);
    });

    it('2nd player 3nd throw', function () {
      expect(engine.isNextThrow()).to.equal(false);
      engine.setThrowValue('20');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(3);
      expect(engine.players[1].lives).to.equal(3);
      expect(engine.players[2].lives).to.equal(1);
    });

    it('3rd player 1st throw', function () {
      expect(engine.isNextPlayer()).to.equal(false);
      engine.setThrowValue('15');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(3);
      expect(engine.players[1].lives).to.equal(2);
      expect(engine.players[2].lives).to.equal(1);
    });

    it('3rd player 2nd throw', function () {
      expect(engine.isNextThrow()).to.equal(true);
      engine.setThrowValue('15');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(3);
      expect(engine.players[1].lives).to.equal(1);
      expect(engine.players[2].lives).to.equal(1);
    });

    it('3rd player 3nd throw', function () {
      expect(engine.isNextThrow()).to.equal(false);
      engine.setThrowValue('15');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(3);
      expect(engine.players[1].lives).to.equal(0);
      expect(engine.players[2].lives).to.equal(1);
      expect(engine.players[1].recoveries).to.equal(0);
      expect(engine.players[1].rip).to.equal(false);
    });

    it('1st player 3 throws', function () {
      engine.setThrowValue('10');
      engine.processThrow();
      engine.setThrowValue('15');
      engine.processThrow();
      engine.setThrowValue('1');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(3);
      expect(engine.players[1].lives).to.equal(0);
      expect(engine.players[2].lives).to.equal(1);
      expect(engine.players[1].recoveries).to.equal(0);
      expect(engine.players[1].rip).to.equal(false);
    });

    it('2nd player 3 throws', function () {
      expect(engine.currentPlayer().num).to.equal('15');
      engine.setThrowValue('10');
      engine.processThrow();
      engine.setThrowValue('15');
      engine.processThrow();
      engine.setThrowValue('10');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(1);
      expect(engine.players[1].lives).to.equal(1);
      expect(engine.players[2].lives).to.equal(1);
      expect(engine.players[1].recoveries).to.equal(0);
      expect(engine.players[1].rip).to.equal(false);
    });

    it('3rd player 3 throws', function () {
      expect(engine.currentPlayer().num).to.equal('20');
      engine.setThrowValue('10');
      engine.processThrow();
      engine.setThrowValue('15');
      engine.processThrow();
      engine.setThrowValue('20');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(0);
      expect(engine.players[0].recoveries).to.equal(0);
      expect(engine.players[0].rip).to.equal(false);
      expect(engine.players[1].lives).to.equal(0);
      expect(engine.players[1].recoveries).to.equal(0);
      expect(engine.players[1].rip).to.equal(true);
      expect(engine.players[2].lives).to.equal(2);
    });

    it('1st player 3 throws', function () {
      expect(engine.currentPlayer().num).to.equal('10');
      engine.setThrowValue('10');
      engine.processThrow();
      engine.setThrowValue('15');
      engine.processThrow();
      engine.setThrowValue('20');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(1);
      expect(engine.players[0].recoveries).to.equal(0);
      expect(engine.players[0].rip).to.equal(false);
      expect(engine.players[1].lives).to.equal(0);
      expect(engine.players[1].recoveries).to.equal(0);
      expect(engine.players[1].rip).to.equal(true);
      expect(engine.players[2].lives).to.equal(1);
    });

    it('3rd player 3 throws (2nd is RIP)', function () {
      expect(engine.currentPlayer().num).to.equal('20');
      engine.setThrowValue('10');
      engine.processThrow();
      expect(engine.players[0].lives).to.equal(0);
      expect(engine.players[0].recoveries).to.equal(0);
      expect(engine.players[0].rip).to.equal(true);
      expect(engine.players[1].lives).to.equal(0);
      expect(engine.players[1].recoveries).to.equal(0);
      expect(engine.players[1].rip).to.equal(true);
      expect(engine.players[2].lives).to.equal(1);
      expect(engine.isGameOver()).to.equal(true);
      expect(engine.winner.name).to.equal(players[2].name);
    });
  })
});
