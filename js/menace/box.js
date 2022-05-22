import { Players } from "../constants.js";

export default class Box {
    constructor(currentState) {
        this.currentState = currentState;
        this.possibleNextStates = [];
        this.createNextStates();
    }

    createNextStates() {
        for (let i = 0; i < this.currentState.length; i++) {
            if (this.currentState[i] === '') {
                const nextState = this.currentState.slice();
                nextState[i] = this.getNextPlayer();
                this.addNextState(new Box(nextState));
            }
        }
    }

    addNextState(nextState) {
        const currentTurnNumber = this.getTurnNumber();
        for (let i = 0; i < 10 - currentTurnNumber; i++) {
            this.possibleNextStates.push(nextState);
        }
    }

    getNextPlayer() {
        return this.currentState.filter(state => state === '').length % 2 === 0 ? Players.O : Players.X;
    }

    getTurnNumber() {
        return this.currentState.filter(state => state !== '').length;
    }

    getNextState() {
        return this.possibleNextStates[Math.floor(Math.random() * this.possibleNextStates.length)];
    }
}