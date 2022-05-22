import { Players } from "../constants.js";
import Box from "./box.js";

export default class Controller {
    constructor(game, player = Players.X) {
        this.game = game;
        this.player = player;
        this.currentState = ['', '', '', '', '', '', '', '', ''];
        this.boxesTree = new Box(this.currentState);
        this.currentBox = this.boxesTree; 
        
        this.game.onTurn(() => this.setStateFromGame()); 
        this.game.onReset(() => this.resetGame()); 
    }

    resetGame() {
        this.currentState = ['', '', '', '', '', '', '', '', ''];
        this.currentBox = this.boxesTree; 
    }

    setStateFromGame() {
        this.currentState = this.game.getState();
        this.findCurrentBox(this.currentBox);
        console.log(this);
    }

    findCurrentBox(box) {
        
        if (this.areTwoStatesEqual(this.currentState, box.currentState)) {
            this.currentBox = box;
            return;
        } 

        const nextStates = new Set(box.possibleNextStates);
        for (let nextState of nextStates) {
            this.findCurrentBox(nextState);
        }
    
    }

    areTwoStatesEqual(state1, state2) {
        return state1.join(' ') === state2.join(' ');
    }
}