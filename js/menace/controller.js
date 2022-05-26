import { Players } from "../constants.js";
import Box from "./box.js";

export default class Controller {
    constructor(game, player = Players.X) {
        this.game = game;
        this.player = player;
        this.currentState = ['', '', '', '', '', '', '', '', ''];
        this.currentGameLog = [];
        this.boxesTree = new Box(this.currentState);
        this.currentBox = this.boxesTree; 
        
        this.game.onTurn(() => this.handleTurn()); 
        this.game.onReset(() => this.resetGame()); 
        this.game.onEnd((winner) => this.handleGameEnd(winner)); 

        if (this.player === Players.X) {

            this.startGame();
        }
    }

    updateBoxesTree(valueArg) {
        let value = valueArg;
        if (value < 0) {
            value = -value;
        }
        let currentBoxTree = this.boxesTree;
        this.currentGameLog.forEach((state) => {
            for (let i = 0; i < 1; i++) {
                let indexToRemove = -1;
                currentBoxTree.possibleNextStates.find((box, j) => {
                    if (this.areTwoStatesEqual(box.currentState, state)) {
                        indexToRemove = j;
                        return true;
                    }
                    return false;
                });

                this.removeBoxFromPossibleStates(currentBoxTree, indexToRemove);
            }
            currentBoxTree = currentBoxTree.possibleNextStates.find((box) => {
                return this.areTwoStatesEqual(box.currentState, state)
            });
        })
    }

    log(state) {
        if (state) {
            this.currentGameLog.push(state);
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

    handleGameEnd({winner, state}) {
        this.log(state);
        if (winner === this.player) {
            this.updateBoxesTree(2);
        } else {
            this.updateBoxesTree(-2);
        }


    }
    
    resetGame() {
        this.currentState = ['', '', '', '', '', '', '', '', ''];
        this.currentBox = this.boxesTree;
        
        if (this.player === Players.X) {
            this.startGame();
        }
    }
    
    handleTurn() {
        const currentGameState = this.game.getState();
        this.log(currentGameState);

        if (this.game.currentPlayer !== this.player || this.game.isEnded) return
        this.game.disableControls();
        this.currentState = currentGameState;
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

    removeBoxFromPossibleStates(box, indexToRemove) {
        if (indexToRemove === -1) return;
        box.possibleNextStates.splice(indexToRemove, 1);
    }
}