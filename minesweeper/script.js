const { body } = document;
const main = document.createElement('main');
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
const result = document.createElement('div');
result.classList.add('result');
wrapper.append(result);
const results = [];

function startGame(width, height, bombsCount) {
  const buttonCount = width * height;
  wrapperField.innerHTML = '<button> </button>'.repeat(buttonCount);
  let bombs = [...Array(buttonCount).keys()].sort(() => Math.random() - 0.5).slice(0, bombsCount);
  const cells = [...wrapperField.children];
  let closedCells = buttonCount;
  let flagsCount = bombsCount;
  mines.innerHTML = flagsCount;
  let clickCount = 0;
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
// localStorage.removeItem('now');
  // новоя херня
  wrapperField.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const index = cells.indexOf(event.target);
      const column = index % width;
      const row = Math.floor(index / width);
      while (firstClick === true && getCount(row, column) !== 0) {
        bombs = [...Array(buttonCount).keys()].sort(() => Math.random()
            - 0.5).slice(0, bombsCount);
      }
      firstClick = false;
      console.log(bombs);
      clickCount += 1;
      myCliks.innerText = clickCount;
      open(row, column);
      // if (isBomb(row, column)) {
      //   wrapperField.removeEventListener('click', () => {
      //   });
      // }
    }
  });

  wrapperField.addEventListener('contextmenu', (event) => {
    if (event.target.tagName === 'BUTTON') {
      event.preventDefault();
      const index = cells.indexOf(event.target);
      const cell = cells[index];
      cell.classList.toggle('flag');
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
  });

  function music() {
    soundButton.classList.toggle('sound-stop');
    console.log('contains ', soundButton.classList.contains('sound-stop'));
    if (soundButton.classList.contains('sound-stop')) {
      sound.volume = 0.25;
      sound.play();
      console.log('pause =', sound.paused);
    } else {
      sound.pause();
      console.log('играет ?');
    }
  }

  // console.log('Бомбы ', bombs);
  soundButton.addEventListener('click', () => {
    music();
  });

  newGame.addEventListener('click', () => {
    startGame(width, height, bombsCount);
    clearInterval(x);
    soundButton.addEventListener('click', () => {
      music();
    });
    // soundButton.className = 'sound-stop';
    // music();
  });
}

startGame(10, 10, 10);
