const currentPlayer = 'X';
const gameContainer = document.querySelector('.game');
const gameControls = document.querySelectorAll('.game__control');
const GameEndClassPrefixes = {
    X1: 'x1',
    X2: 'x2',
    V1: 'v1',
    V2: 'v2',
    V3: 'v3',
    H1: 'h1',
    H2: 'h2',
    H3: 'h3',
}
const handleGameEnd = (prefix) => {
    const gameEndClass = `game--end-${prefix}`;

    gameContainer.classList.add(gameEndClass);
}
const checkWinner = () => {
    const gameValues = [...gameControls].map((control) => control.querySelector('span').textContent.trim());

    switch (true) {
        case gameValues[0] === gameValues[1] && gameValues[1] === gameValues[2]:
            handleGameEnd(GameEndClassPrefixes.H1);
            break;
        case gameValues[3] === gameValues[4] && gameValues[4] === gameValues[5]:
            handleGameEnd(GameEndClassPrefixes.H2);
            break;
        case gameValues[6] === gameValues[7] && gameValues[7] === gameValues[8]:
            handleGameEnd(GameEndClassPrefixes.H3);
            break;
        case gameValues[0] === gameValues[3] && gameValues[3] === gameValues[6]:
            handleGameEnd(GameEndClassPrefixes.V1);
            break;
        case gameValues[1] === gameValues[4] && gameValues[4] === gameValues[7]:
            handleGameEnd(GameEndClassPrefixes.V2);
            break;
        case gameValues[2] === gameValues[5] && gameValues[5] === gameValues[8]:
            handleGameEnd(GameEndClassPrefixes.V3);
            break;
        case gameValues[0] === gameValues[4] && gameValues[4] === gameValues[8]:
            handleGameEnd(GameEndClassPrefixes.X1);
            break;
        case gameValues[2] === gameValues[4] && gameValues[4] === gameValues[6]:
            handleGameEnd(GameEndClassPrefixes.X2);
            break;
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
    const { target } = e;

    if (target.textContent.trim()) {
        return;
    }

    target.querySelector('span').textContent = currentPlayer;

    checkGameState();
}
gameControls.forEach((control) => control.addEventListener('click', handleControlClick));
