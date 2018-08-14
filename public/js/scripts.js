
const getRandomHexColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`; // 16777215 = #ffffff;
const randomButton = document.querySelector('.controls-section__button');
const colorBlockList = document.querySelectorAll('.color-blocks__block');

const setColorPallet = () => {
  colorBlockList.forEach((block, index) => {
    block.setAttribute('style', `--color-${index + 1}: ${getRandomHexColor()}`);
  });
};

randomButton.addEventListener('click', setColorPallet);