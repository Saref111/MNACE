const Players = {
    X: 'X',
    O: 'O'
}
const GameEndClassPrefixes = {
    X1: 'x1',
    X2: 'x2',
    V1: 'v1',
    V2: 'v2',
    V3: 'v3',
    H1: 'h1',
    H2: 'h2',
    H3: 'h3',
    D: 'd'
}
let currentPlayer = Players.X;
const gameContainer = document.querySelector('.game');
const gameControls = document.querySelectorAll('.game__control');

const changePlayer = () => currentPlayer = currentPlayer === Players.X ? Players.O : Players.X;
const handleGameRestart = () => {
    gameContainer.classList.remove(`game--end`);
    gameContainer.classList.remove(`game--end-${GameEndClassPrefixes.D}`, `game--end-${GameEndClassPrefixes.X1}`, `game--end-${GameEndClassPrefixes.X2}`, `game--end-${GameEndClassPrefixes.V1}`, `game--end-${GameEndClassPrefixes.V2}`, `game--end-${GameEndClassPrefixes.V3}`, `game--end-${GameEndClassPrefixes.H1}`, `game--end-${GameEndClassPrefixes.H2}`, `game--end-${GameEndClassPrefixes.H3}`);
    gameContainer.removeEventListener('click', handleGameRestart);
    Array.from(gameControls).forEach((control) => control.querySelector('span').textContent = '');
}
const handleGameEnd = (prefix) => {
    const gameEndClass = `game--end-${prefix}`;
    gameContainer.classList.add(`game--end`);
    gameContainer.classList.add(gameEndClass);
    gameContainer.addEventListener('click', handleGameRestart);
}
const checkWinner = () => {
    const gameValues = [...gameControls].map((control) => control.querySelector('span').textContent.trim());
    
    switch (true) {
        case gameValues[0] === gameValues[1] && gameValues[1] === gameValues[2] && gameValues[0] !== '':
            handleGameEnd(GameEndClassPrefixes.H1);
            return;
        case gameValues[3] === gameValues[4] && gameValues[4] === gameValues[5] && gameValues[3] !== '':
            handleGameEnd(GameEndClassPrefixes.H2);
            return;
        case gameValues[6] === gameValues[7] && gameValues[7] === gameValues[8] && gameValues[6] !== '':
            handleGameEnd(GameEndClassPrefixes.H3);
            return;
        case gameValues[0] === gameValues[3] && gameValues[3] === gameValues[6] && gameValues[0] !== '':
            handleGameEnd(GameEndClassPrefixes.V1);
            return;
        case gameValues[1] === gameValues[4] && gameValues[4] === gameValues[7] && gameValues[1] !== '':
            handleGameEnd(GameEndClassPrefixes.V2);
            return;
        case gameValues[2] === gameValues[5] && gameValues[5] === gameValues[8] && gameValues[2] !== '':
            handleGameEnd(GameEndClassPrefixes.V3);
            return;
        case gameValues[0] === gameValues[4] && gameValues[4] === gameValues[8] && gameValues[0] !== '':
            handleGameEnd(GameEndClassPrefixes.X1);
            return;
        case gameValues[2] === gameValues[4] && gameValues[4] === gameValues[6] && gameValues[2] !== '':
            handleGameEnd(GameEndClassPrefixes.X2);
            return;
    }

    if (!gameValues.includes('')) {
        handleGameEnd(GameEndClassPrefixes.D);
    }
}
const checkGameState = () => {
    const { x, o } = Array.from(gameControls).reduce((acc, control) => {
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
        checkWinner()
    }
}

const handleControlClick = (e) => {
    e.stopPropagation();
    const { target } = e;

    if (target.textContent.trim()) {
        return;
    }

    target.querySelector('span').textContent = currentPlayer;

    checkGameState();
    changePlayer();
}

gameControls.forEach((control) => control.addEventListener('click', handleControlClick));