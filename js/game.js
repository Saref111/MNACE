import {GameEndClassPrefixes, Players} from './constants.js';

export default class Game {
    constructor() {
        this.currentPlayer = Players.X;
        this.gameContainer = document.querySelector('.game');
        this.gameControls = document.querySelectorAll('.game__control');
        

        this.gameControls.forEach((control) => control.addEventListener('click', this.handleControlClick));
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
                this.handleGameEnd(GameEndClassPrefixes.H1);
                return;
            case gameValues[3] === gameValues[4] && gameValues[4] === gameValues[5] && gameValues[3] !== '':
                this.handleGameEnd(GameEndClassPrefixes.H2);
                return;
            case gameValues[6] === gameValues[7] && gameValues[7] === gameValues[8] && gameValues[6] !== '':
                this.handleGameEnd(GameEndClassPrefixes.H3);
                return;
            case gameValues[0] === gameValues[3] && gameValues[3] === gameValues[6] && gameValues[0] !== '':
                this.handleGameEnd(GameEndClassPrefixes.V1);
                return;
            case gameValues[1] === gameValues[4] && gameValues[4] === gameValues[7] && gameValues[1] !== '':
                this.handleGameEnd(GameEndClassPrefixes.V2);
                return;
            case gameValues[2] === gameValues[5] && gameValues[5] === gameValues[8] && gameValues[2] !== '':
                this.handleGameEnd(GameEndClassPrefixes.V3);
                return;
            case gameValues[0] === gameValues[4] && gameValues[4] === gameValues[8] && gameValues[0] !== '':
                this.handleGameEnd(GameEndClassPrefixes.D);
                return;
            case gameValues[2] === gameValues[4] && gameValues[4] === gameValues[6] && gameValues[2] !== '':
                this.handleGameEnd(GameEndClassPrefixes.D);
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
    }

    handleGameEnd = (prefix) => {
        const gameEndClass = `game--end-${prefix}`;
        this.gameContainer.classList.add(`game--end`);
        this.gameContainer.classList.add(gameEndClass);
        this.gameContainer.addEventListener('click', this.handleGameRestart);
    }

    handleGameRestart = () => {
        this.gameContainer.classList.remove(`game--end`);
        this.gameContainer.classList.remove(`game--end-${GameEndClassPrefixes.D}`, `game--end-${GameEndClassPrefixes.X1}`, `game--end-${GameEndClassPrefixes.X2}`, `game--end-${GameEndClassPrefixes.V1}`, `game--end-${GameEndClassPrefixes.V2}`, `game--end-${GameEndClassPrefixes.V3}`, `game--end-${GameEndClassPrefixes.H1}`, `game--end-${GameEndClassPrefixes.H2}`, `game--end-${GameEndClassPrefixes.H3}`);
        this.gameContainer.removeEventListener('click', this.handleGameRestart);
        Array.from(this.gameControls).forEach((control) => control.querySelector('span').textContent = '');
        this.gameContainer.removeEventListener('click', this.handleGameRestart);
        this.currentPlayer = Players.X;
    }
}