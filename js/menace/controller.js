import { Players } from "../constants.js";
import Box from "./box.js";

export default class Controller {
    constructor(game, player = Players.X) {
        this.game = game;
        this.player = player;
        this.currentState = ['', '', '', '', '', '', '', '', ''];
        this.boxesTree = new Box(this.currentState);
        this.currentBox = this.boxesTree; 
        
        this.game.onTurn(() => this.handleTurn()); 
        this.game.onReset(() => this.resetGame()); 

        if (this.player === Players.X) {

            this.startGame();
        }
    }

    makeTurn() {
        this.currentBox = this.currentBox.getNextState();
        this.game.setState(this.currentBox);
    }

    startGame() {
        this.game.disableControls();
        this.makeTurn();
        this.game.enableControls();
    }
    
    resetGame() {
        this.currentState = ['', '', '', '', '', '', '', '', ''];
        this.currentBox = this.boxesTree;
        
        if (this.player === Players.X) {
            this.startGame();
        }
    }
    
    handleTurn() {
        if (this.game.currentPlayer !== this.player || this.game.isEnded) return
        this.game.disableControls();
        this.currentState = this.game.getState();
        this.updateCurrentBox(this.currentBox);
        this.makeTurn();
        this.game.enableControls();
    }

    updateCurrentBox(box) {
        
        if (this.areTwoStatesEqual(this.currentState, box.currentState)) {
            this.currentBox = box;
            return;
        } 

        const nextStates = new Set(box.possibleNextStates);
        for (let nextState of nextStates) {
            this.updateCurrentBox(nextState);
        }
    
    }

    areTwoStatesEqual(state1, state2) {
        return state1.every((value, index) => value === state2[index]);
    }
}