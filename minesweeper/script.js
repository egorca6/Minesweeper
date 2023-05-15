const { body } = document;
const main = document.createElement('main');
main.classList.add('main');
body.append(main);
const title = document.createElement('h1');
title.textContent = 'Сапер';
main.append(title);
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

function startGame(width, height, bombsCount) {
  const buttonCount = width * height;
  wrapperField.innerHTML = '<button> </button>'.repeat(buttonCount);
  const bombs = [...Array(buttonCount).keys()].sort(() => Math.random() - 0.5).slice(0, bombsCount);
  const cells = [...wrapperField.children];
  let closedCells = buttonCount;
  let flagsCount = bombsCount;
  mines.innerHTML = flagsCount;

  const startTime = new Date();
  const x = setInterval(() => {
    const newTime = new Date();
    const z = Math.floor((newTime - startTime) / 1000);
    time.innerHTML = z;
  }, 1000);

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

  function open(row, column) {
    if (!isValid(row, column)) return;

    const index = row * width + column;
    const cell = cells[index];
    const count = getCount(row, column);
    if (cell.disabled === true) return;
    cell.disabled = true;
    closedCells -= 1;
    if (closedCells <= bombsCount) {
      alert('Hooray! You found all mines in ## seconds and N moves!');
    }
    if (isBomb(row, column)) {
      cell.classList.add('on');
      alert('Game over. Try again');
      clearInterval(x);
      return;
    } if (count !== 0) {
      cell.innerHTML = count;
      return;
    }
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        open(row + j, column + i);
      }
    }
  }

  wrapperField.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const index = cells.indexOf(event.target);
      const column = index % width;
      const row = Math.floor(index / width);
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

  newGame.addEventListener('click', () => {
    startGame(10, 10, 10);
    clearInterval(x);
  });
  console.log('Бомбы ', bombs);
    // setInterval(time.innerHTML, 1000);
    // time.innerHTML = startTime.getSeconds();
}

startGame(10, 10, 10);
