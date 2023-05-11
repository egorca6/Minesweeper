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
console.log(wrapperField);

function startGame(width, height, bombsCount) {
  const cells = width * height;
  wrapperField.innerHTML = '<button> </button>'.repeat(cells);
  const bombs = [...Array(cells).keys()].sort(() => Math.random() - 0.5).slice(0, bombsCount);
  console.log(bombs);
}

startGame(10, 10, 10);

wrapper.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    console.log(event.target);
}
});
