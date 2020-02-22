import { expect } from 'chai'
import {Engine} from "../../src/engine";

describe('Engine', () => {

  it('should save players', () => {
    let engine = new Engine([{player: 'Sasha'}]);
    expect(engine.players[0].name === 'Sasha');
  })
});
