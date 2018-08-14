const colorBlockList = document.querySelectorAll('.color-blocks__block');
const colorBlockSection = document.querySelector('.color-blocks');
const openLockList = document.querySelectorAll('.fa-lock-open');
const randomButton = document.querySelector('.controls-section__button');
const getRandomHexColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`; // 16777215 = #ffffff;

const setColorPallet = () => {
  colorBlockList.forEach((block, index) => {
    block.setAttribute('style', `--color-${index + 1}: ${getRandomHexColor()}`);
  });
};

colorBlockSection.addEventListener('click', event => {
  if (event.target.tagName === 'I') {
    event.target.classList.toggle('fa-lock-open');
  }
});

randomButton.addEventListener('click', setColorPallet);
