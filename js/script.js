import Game from './game.js';
import Controller from './menace/controller.js';

const game = new Game();

const menace = new Controller(game);

console.log(menace);