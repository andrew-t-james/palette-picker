const colorBlockList = document.querySelectorAll('.color-blocks__block');
const colorBlockSection = document.querySelector('.color-blocks');
const randomButton = document.querySelector('.controls-section__button');
const getRandomHexColor = () => `#${Math.random().toString(16).slice(2, 8)}`; // 16777215 = #ffffff;
const pallet = {
  pallet: null,
  colors: [
    {
      color: '#0d1b2a',
      saved: false
    }, {
      color: '#1b263b',
      saved: false
    }, {
      color: '#415a77',
      saved: false
    }, {
      color: '#7b9e87',
      saved: false
    }, {
      color: '#e0e1dd',
      saved: false
    }
  ]
};

const setRandomColorPallet = () => {
  colorBlockList.forEach((block, index) => {
    const newHexColor =  getRandomHexColor();
    pallet.colors[index].color = newHexColor;
    console.log(newHexColor);
    block.setAttribute('style', `--color-${index + 1}: ${newHexColor}`);
  });
};

colorBlockSection.addEventListener('click', event => {
  const parentBackgroundColor= window.getComputedStyle(event.target.parentNode).backgroundColor;

  if (event.target.tagName === 'I') {
    console.log(parentBackgroundColor);
    event.target.classList.toggle('fa-lock-open');
  }
});

randomButton.addEventListener('click', setRandomColorPallet);

// window.addEventListener('load', () => {
//   colorBlockList.forEach((block, index) => {
//     block.setAttribute('style', `--color-${index + 1}: ${pallet.colors[index].color}`);
//   });
// });