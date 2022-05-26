import {GameEndClassPrefixes, Players} from './constants.js';

export default class Game {
    constructor() {
        this.currentPlayer = Players.X;
        this.gameContainer = document.querySelector('.game');
        this.gameControls = document.querySelectorAll('.game__control');
        this.disableControls();
        this.gameStats = document.querySelector('.stats');
        this.isEnded = false;
        this.count = {
            'X': 0,
            'O': 0
        }
        
        this.turnCallbacks = [];
        this.resetCallbacks = [];
        this.endCallbacks = [];
        
        
        this.gameControls.forEach((control) => control.addEventListener('click', this.handleControlClick));
        this.enableControls();
    }

    onTurn(callback) {
        this.turnCallbacks.push(callback);
    }
    onReset(callback) {
        this.resetCallbacks.push(callback);
    }
    onEnd(callback) {
        this.endCallbacks.push(callback);
    }

    setState(box) {
        if (!box) return

        const controls = this.gameContainer.querySelectorAll('.game__value');
        Array.from(controls).forEach((value, index) => {
            if (value.textContent !== box.currentState[index]) {
                this.handleControlClick({target: value.parentElement, stopPropagation: () => {}});
            }
        });
    }

    getState() {
        const boxes = this.gameContainer.querySelectorAll('.game__value');
        return Array.from(boxes).map((value) => value.textContent.trim());
    }

    changePlayer = () => {
        this.currentPlayer = this.currentPlayer === Players.X ? Players.O : Players.X;
    }

    checkWinner = () => {
        const gameValues = [...this.gameControls].map((control) => {
            return control.querySelector('span').textContent.trim()
        });

        switch (true) {
            case gameValues[0] === gameValues[1] && gameValues[1] === gameValues[2] && gameValues[0] !== '':
                this.handleGameEnd(GameEndClassPrefixes.H1, gameValues[0]);
                return;
            case gameValues[3] === gameValues[4] && gameValues[4] === gameValues[5] && gameValues[3] !== '':
                this.handleGameEnd(GameEndClassPrefixes.H2, gameValues[3]);
                return;
            case gameValues[6] === gameValues[7] && gameValues[7] === gameValues[8] && gameValues[6] !== '':
                this.handleGameEnd(GameEndClassPrefixes.H3, gameValues[6]);
                return;
            case gameValues[0] === gameValues[3] && gameValues[3] === gameValues[6] && gameValues[0] !== '':
                this.handleGameEnd(GameEndClassPrefixes.V1, gameValues[0]);
                return;
            case gameValues[1] === gameValues[4] && gameValues[4] === gameValues[7] && gameValues[1] !== '':
                this.handleGameEnd(GameEndClassPrefixes.V2, gameValues[1]);
                return;
            case gameValues[2] === gameValues[5] && gameValues[5] === gameValues[8] && gameValues[2] !== '':
                this.handleGameEnd(GameEndClassPrefixes.V3, gameValues[2]);
                return;
            case gameValues[0] === gameValues[4] && gameValues[4] === gameValues[8] && gameValues[0] !== '':
                this.handleGameEnd(GameEndClassPrefixes.X1, gameValues[0]);
                return;
            case gameValues[2] === gameValues[4] && gameValues[4] === gameValues[6] && gameValues[2] !== '':
                this.handleGameEnd(GameEndClassPrefixes.X2, gameValues[2]);
                return;
            }
        if (!gameValues.includes('')) {
            this.handleGameEnd(GameEndClassPrefixes.D);
        }
    }

    checkGameState = () => {
        const { x, o } = Array.from(this.gameControls).reduce((acc, control) => {
            const { textContent } = control.querySelector('span');
            const controlValue = textContent.trim();

            if (controlValue === 'X') {
                acc.x++;
            } else if (controlValue === 'O') {
                acc.o++;
            }

            return acc;
        }, { x: 0, o: 0 });

        if (x >= 3 || o.length <= 3) {
            this.checkWinner();
        }
    }

    handleControlClick = (e) => {
        e.stopPropagation();
        const { target } = e;

        if (target.textContent.trim()) {
            return;
        }

        target.querySelector('span').textContent = this.currentPlayer;

        this.checkGameState();
        this.changePlayer();
        this.turnCallbacks.forEach((callback) => callback());
    }

    handleGameEnd = (prefix, winner) => {

        this.isEnded = true;
        const gameEndClass = `game--end-${prefix}`;
        this.gameContainer.classList.add(`game--end`);
        this.gameContainer.classList.add(gameEndClass);
        this.gameContainer.addEventListener('click', this.handleGameRestart);
        this.gameContainer.addEventListener('keypress', this.handleGameRestart);
        
        if (winner) {
            this.handleStat(winner)
        }

        this.endCallbacks.forEach((callback) => callback({winner, state: this.getState()}));
    } 

    disableControls = () => {
        this.gameControls.forEach((control) => control.disabled = true);
    }
    enableControls = () => {
        this.gameControls.forEach((control) => control.disabled = false);
    }

    handleStat = (winner) => {
        const tds = this.gameStats.querySelectorAll('td');

        this.count[winner]++;

        tds[0].textContent = this.count['X'];
        tds[1].textContent = this.count['O'];
    }
    
    handleGameRestart = () => {
        this.isEnded = false;
        this.gameContainer.classList.remove(`game--end`);
        this.gameContainer.classList.remove(`game--end-${GameEndClassPrefixes.D}`, `game--end-${GameEndClassPrefixes.X1}`, `game--end-${GameEndClassPrefixes.X2}`, `game--end-${GameEndClassPrefixes.V1}`, `game--end-${GameEndClassPrefixes.V2}`, `game--end-${GameEndClassPrefixes.V3}`, `game--end-${GameEndClassPrefixes.H1}`, `game--end-${GameEndClassPrefixes.H2}`, `game--end-${GameEndClassPrefixes.H3}`);
        this.gameContainer.removeEventListener('click', this.handleGameRestart);
        this.gameContainer.removeEventListener('keypress', this.handleGameRestart);
        Array.from(this.gameControls).forEach((control) => control.querySelector('span').textContent = '');
        this.currentPlayer = Players.X;
        this.resetCallbacks.forEach((callback) => callback());
    }
}