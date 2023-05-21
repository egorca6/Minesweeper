let body = document.querySelector('body');
const main = document.createElement('main');
const saveButton = document.createElement('button');
saveButton.classList.add('save-button');
saveButton.textContent = 'Save';
main.append(saveButton);
const loadButton = document.createElement('button');
loadButton.classList.add('save-button');
loadButton.textContent = 'Load';
main.append(loadButton);
const statsButton = document.createElement('button');
statsButton.classList.add('save-button');
statsButton.textContent = 'Stats';
main.append(statsButton);
const result = document.createElement('div');
result.classList.add('result-hide');
main.append(result);
main.classList.add('main');
body.append(main);
const title = document.createElement('h1');
title.textContent = 'Сапер';
main.append(title);
const navbar = document.createElement('div');
navbar.classList.add('navbar');
main.append(navbar);
const myCliks = document.createElement('div');
myCliks.classList.add('myCliks');
myCliks.innerText = 'Всего кликов = ';
navbar.append(myCliks);
const levelDiv = document.createElement('div');
levelDiv.classList.add('level-div');
navbar.append(levelDiv);
const level = document.createElement('button');
level.classList.add('level');
levelDiv.append(level);
const minesNumber = document.createElement('input');
minesNumber.classList.add('mines-number');
levelDiv.append(minesNumber);
const changeMines = document.createElement('button');
changeMines.classList.add('change-mines');
navbar.append(changeMines);
const darkLight = document.createElement('button');
darkLight.classList.add('dark-light');
navbar.append(darkLight);
const soundButton = document.createElement('button');
soundButton.innerHTML = `<audio id="clickSound" src="./assets/sounds/background_music2.mp3">
</audio>`;
soundButton.classList.add('sound');
navbar.append(soundButton);
const soundWin = document.createElement('audio');
soundWin.src = './assets/sounds/winGame.mp3';
navbar.append(soundWin);
const sound = document.querySelector('#clickSound');
const goodClick = document.createElement('audio');
goodClick.src = './assets/sounds/goodClick2.mp3';
navbar.append(goodClick);
const badClick = document.createElement('audio');
badClick.src = './assets/sounds/mine.mp3';
navbar.append(badClick);
const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');
main.append(wrapper);
const footer = document.createElement('div');
footer.classList.add('footer');
main.append(footer);
const wrapperTop = document.createElement('div');
wrapperTop.classList.add('wrapper-top');
wrapper.append(wrapperTop);
const wrapperField = document.createElement('div');
wrapperField.classList.add('wrapper-field');
wrapper.append(wrapperField);
const mines = document.createElement('div');
mines.classList.add('mines');
wrapperTop.append(mines);
const newGame = document.createElement('button');
newGame.classList.add('new-game');
wrapperTop.append(newGame);
newGame.innerHTML = 'New Game';
const time = document.createElement('div');
time.classList.add('time');
wrapperTop.append(time);
let results = [];
let gameOver = false;
let gameState = {};

function startGame(width, height, bombsCount) {
  const buttonCount = width * height;
  wrapperField.innerHTML = '<button class = "cell"> </button>'.repeat(buttonCount);
  let bombs = [...Array(buttonCount).keys()].sort(() => Math.random() - 0.5).slice(0, bombsCount);
  let cells = [...wrapperField.children];
  let closedCells = buttonCount;
  let flagsCount = bombsCount;
  mines.innerHTML = flagsCount;
  let clickCount = 0;
  let buttons = wrapperField.querySelectorAll('button');
  const startTime = new Date();
  const x = setInterval(() => {
    const newTime = new Date();
    const z = Math.floor((newTime - startTime) / 1000);
    time.innerHTML = z;
  }, 1000);

  let firstClick = true;

  function isValid(row, column) {
    return row >= 0
    && row < height
    && column >= 0
    && column < width;
  }

  function isBomb(row, column) {
    if (!isValid(row, column)) return false;
    const index = row * width + column;
    return bombs.includes(index);
  }

  function getCount(row, column) {
    let count = 0;
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        if (isBomb(row + j, column + i)) {
          count += 1;
        }
      }
    }
    return count;
  }

  function showResult(row, column) {
    gameOver = true;
    if (isBomb(row, column)) {
      results.push(`lose за ходов = ${clickCount}`);
      if (results.length > 10) {
        results.shift();
      }
      localStorage.setItem('result', JSON.stringify(results));
    } else {
      results.push(`win за ходов = ${clickCount}`);
      if (results.length > 10) {
        results.shift();
      }
      localStorage.setItem('result', JSON.stringify(results));
    }
    const myResult = JSON.parse(localStorage.getItem('result'));
    result.innerHTML = '';
    myResult.forEach((res) => {
      const resultElement = document.createElement('div');
        resultElement.textContent = res;
        result.append(resultElement);
      wrapperField.removeEventListener('contextmenu', contextMenuEvent);
    });
  }

  function open(row, column) {
    if (!isValid(row, column)) return;
    const index = row * width + column;
    const cell = cells[index];
    const count = getCount(row, column);
    if (cell.disabled === true) return;
    cell.disabled = true;
    closedCells -= 1;
    if (closedCells <= bombsCount) {
      if (soundButton.classList.contains('sound-stop')) {
        soundWin.play();
        soundWin.volume = 0.5;
      }
      alert(`Hooray! You found all mines in ${time.innerHTML} seconds and ${clickCount} moves!`);
      clearInterval(x);
      showResult(row, column);
    }
    if (isBomb(row, column)) {
      cell.classList.add('on');
      if (soundButton.classList.contains('sound-stop')) {
        badClick.play();
        badClick.volume = 0.5;
      }
      alert('Game over. Try again');
      clearInterval(x);
      showResult(row, column);
      return;
    } if (count !== 0) {
      if (count === 1) {
        cell.classList.add('one');
      }
      if (count === 2) {
        cell.classList.add('two');
      }
      if (count === 3) {
        cell.classList.add('three');
      }
      if (count === 4) {
        cell.classList.add('four');
      }
      if (count === 5) {
        cell.classList.add('five');
      }
      cell.innerHTML = count;
      if (soundButton.classList.contains('sound-stop')) {
        goodClick.play();
        goodClick.volume = 0.3;
      }
      return;
    }
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        open(row + j, column + i);
      }
    }
  }

  function clickEvent(event) {
    if (gameOver || event.target.tagName !== 'BUTTON') return;
    if (event.target.tagName === 'BUTTON') {
      // console.log('firstClick начало - ', firstClick);
      // console.log('height, width', height, width);
      cells = [...wrapperField.children];
      const index = cells.indexOf(event.target);
      const column = index % width;
      const row = Math.floor(index / width);
      while (firstClick === true && getCount(row, column) !== 0) {
        bombs = [...Array(buttonCount).keys()].sort(() => Math.random()
            - 0.5).slice(0, bombsCount);
      }
      firstClick = false;
      // console.log('index, column, row', index, column, row);
      // console.log('!isValid? =  ', !isValid(row, column));
      clickCount += 1;
      myCliks.innerText = clickCount;
      open(row, column);
    }
  }

  function contextMenuEvent(event) {
    // console.log(event.target.tagName === 'BUTTON');
    if (event && event.target && event.target.tagName === 'BUTTON') {
      event.preventDefault();
      cells = [...wrapperField.children];
      const index = cells.indexOf(event.target);
      const cell = cells[index];
      cell.classList.toggle('flag');
      console.log(!cell.disabled);
      if (cell.classList.contains('flag') && mines.innerHTML > 0) {
        flagsCount -= 1;
        mines.innerHTML = flagsCount;
        cell.disabled = true;
      } else {
        flagsCount += 1;
        mines.innerHTML = flagsCount;
        cell.disabled = false;
      }
    }
  }

  wrapperField.addEventListener('contextmenu', contextMenuEvent);

  function music() {
    soundButton.classList.toggle('sound-stop');
    if (soundButton.classList.contains('sound-stop')) {
      sound.volume = 0.25;
      sound.play();
    } else {
      sound.pause();
    }
  }

  soundButton.addEventListener('click', music);

  const newGameClick = () => {
    gameOver = false;
    wrapperField.removeEventListener('click', clickEvent);
    newGame.removeEventListener('click', newGameClick);
    wrapperField.removeEventListener('contextmenu', contextMenuEvent);
    startGame(width, height, minesNumber.value);
    clearInterval(x);
    soundButton.addEventListener('click', () => {
      music();
    });
    statsButton.addEventListener('click', () => {
      result.classList.toggle('result');
    });
  };

  newGame.addEventListener('click', newGameClick);

  function doDark() {
    // body = document.querySelector('body');
    // body.classList.toggle('black');
    buttons.forEach((button) => {
      button.classList.toggle('black');
    });
  }

  darkLight.addEventListener('click', doDark);

  minesNumber.value = bombsCount;

  let levelGame = 0;

  function setGameLevel() {
    gameOver = false;
    levelGame = (levelGame + 1) % 3;
    switch (levelGame) {
      case 0:
        console.log('Легкий уровень игры');
        level.className = 'level1';
        break;
      case 1:
        level.className = 'level2';
        console.log('Средний уровень игры');
        break;
      case 2:

        console.log('Тяжелый уровень игры');
        level.className = 'level3';
        break;
      default:
        console.log('Некорректный уровень');
    }
    clearInterval(x);
  }
  // level.removeEventListener('click', setGameLevel);
  level.addEventListener('click', setGameLevel);

  function saveGame() {
    gameState.field = wrapperField.innerHTML;
    gameState.closedCells = closedCells;
    gameState.flagsCount = flagsCount;
    gameState.clickCount = clickCount;
    gameState.time = time.innerHTML;
    gameState.results = results;
    gameState.bombs = bombs;
    gameState.level = level.className;
    gameState.wrapperField = wrapperField.className;
    gameState.wrapper = wrapper.className;
    gameState.width = width;
    gameState.height = height;
    gameState.minesNumber = minesNumber.value;
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }

  function loadGame() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      darkLight.removeEventListener('click', doDark);
      gameState = JSON.parse(savedState);
      wrapperField.innerHTML = gameState.field;
      closedCells = gameState.closedCells;
      flagsCount = gameState.flagsCount;
      clickCount = gameState.clickCount;
      mines.innerHTML = flagsCount;
      time.innerHTML = gameState.time;
      results = gameState.results;
      bombs = gameState.bombs;
      level.className = gameState.level;
      wrapperField.className = gameState.wrapperField;
      wrapper.className = gameState.wrapper;
      minesNumber.value = gameState.minesNumber;
      width = gameState.width;
      height = gameState.height;
      firstClick = false;
      wrapperField.addEventListener('click', clickEvent);
      wrapperField.addEventListener('contextmenu', contextMenuEvent);
      buttons = wrapperField.querySelectorAll('button');
      darkLight.addEventListener('click', () => {
        doDark();
      });
    }
  }

  saveButton.addEventListener('click', saveGame);
  loadButton.addEventListener('click', loadGame);
  wrapperField.addEventListener('click', clickEvent);

  function confirmGameLevel() {
    gameOver = false;
    darkLight.removeEventListener('click', doDark);
    wrapperField.removeEventListener('click', clickEvent);
    wrapperField.removeEventListener('contextmenu', contextMenuEvent);
    newGame.removeEventListener('click', newGameClick);
    if (levelGame === 1) {
      wrapperField.className = 'wrapper-field-medium';
      wrapper.className = 'wrapper-medium';
      startGame(15, 15, minesNumber.value);
      buttons = wrapperField.querySelectorAll('button');
      buttons.forEach((button) => {
        button.classList.add('button-medium');
      });
    } else if (levelGame === 2) {
      wrapperField.className = 'wrapper-field-hard';
      wrapper.className = 'wrapper-hard';
      startGame(25, 25, minesNumber.value);
      buttons = wrapperField.querySelectorAll('button');
      buttons.forEach((button) => {
        button.classList.add('button-hard');
      });
    } else {
      wrapperField.className = 'wrapper-field';
      wrapper.className = 'wrapper';
      startGame(10, 10, minesNumber.value);
    }
    clearInterval(x);
    soundButton.addEventListener('click', () => {
      music();
    });
    statsButton.addEventListener('click', () => {
      result.classList.toggle('result');
    });
    wrapperField.addEventListener('contextmenu', () => {
      contextMenuEvent();
    });
    changeMines.removeEventListener('click', confirmGameLevel);
  }

  changeMines.addEventListener('click', confirmGameLevel);

  statsButton.addEventListener('click', () => {
    result.classList.toggle('result');
  });
}

startGame(10, 10, 10);
// localStorage.clear();
