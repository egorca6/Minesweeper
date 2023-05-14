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

function startGame(width, height, bombsCount) {
  const buttonCount = width * height;
  wrapperField.innerHTML = '<button> </button>'.repeat(buttonCount);
  const bombs = [...Array(buttonCount).keys()].sort(() => Math.random() - 0.5).slice(0, bombsCount);
  const cells = [...wrapperField.children];

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
    if (isBomb(row, column)) {
      cell.classList.add('on');
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

    console.log('БАХ');
    // cell.innerHTML = '';
  }

  wrapper.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const index = cells.indexOf(event.target);
      const column = index % width;
      const row = Math.floor(index / width);
      //  console.log('+1 = ', bombs.includes(index + 1));
      // console.log('Индекс ', index);
      // console.log('Кнопка = ', cells[index]);
      open(row, column);
    }
  });
  console.log('Бомбы ', bombs);
}

startGame(10, 10, 10);
