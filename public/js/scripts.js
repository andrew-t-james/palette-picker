const colorBlockList = document.querySelectorAll('.color-blocks__block');
const hexColorValue = document.querySelectorAll('.color-blocks__hex-color');
const colorBlockSection = document.querySelector('.color-blocks');
const randomButton = document.querySelector('.controls-section__button');
const getRandomHexColor = () => `#${Math.random().toString(16).slice(2, 8)}`;
const pallet = {
  title: null,
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
    if (!pallet.colors[index].saved) {
      const newHexColor = getRandomHexColor();
      pallet.colors[index].color = newHexColor;
      hexColorValue[index].innerText = newHexColor;
      block.setAttribute('style', `--color-${index + 1}: ${newHexColor}`);
    }
  });
};


colorBlockSection.addEventListener('click', event => {
  const lockButton = event.target;
  const hexCode = event.target.parentNode.getElementsByTagName('P')[0].innerText;
  const locked = pallet.colors.find(hex => hex.color === hexCode);
  locked.saved = !locked.saved;
  console.log(pallet.colors);
  if (event.target.tagName === 'I') {
    lockButton.classList.toggle('fa-lock-open');
  }
});

randomButton.addEventListener('click', setRandomColorPallet);