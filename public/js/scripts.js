const colorBlockSection = document.querySelector('.color-blocks');
const randomButton = document.querySelector('.controls-section__button');
const getRandomHexColor = () => `#${Math.random().toString(16).slice(2, 8)}`;
const palette = {
  title: null,
  colors: [
    {
      color_1: '#0d1b2a',
      saved: false
    }, {
      color_2: '#1b263b',
      saved: false
    }, {
      color_3: '#415a77',
      saved: false
    }, {
      color_4: '#7b9e87',
      saved: false
    }, {
      color_5: '#e0e1dd',
      saved: false
    }
  ]
};

const setRandomColorPallet = () => {
  const colorBlockList = document.querySelectorAll('.color-blocks__block');
  const hexColorValue = document.querySelectorAll('.color-blocks__hex-color');
  colorBlockList.forEach((block, index) => {
    if (!palette.colors[index].saved) {
      const newHexColor = getRandomHexColor();
      palette.colors[index][`color_${index + 1}`] = newHexColor;
      hexColorValue[index].innerText = newHexColor;
      block.setAttribute('style', `--color-${index + 1}: ${newHexColor}`);
    }
  });
};

const lockColor = event => {
  const lockButton = event.target;
  const hexCode = event.target.parentNode.getElementsByTagName('P')[0].innerText;
  const locked = palette.colors.find((hex, index) => hex[`color_${index + 1}`] === hexCode);
  locked.saved = !locked.saved;
  if (event.target.tagName === 'I') {
    lockButton.classList.toggle('fa-lock-open');
  }
};

const getProjects = async () => {
  const response = await fetch('/api/v1/projects');
  const projects = await response.json();
  return projects;
};

const getPalettes = async () => {
  const response = await fetch('/api/v1/palettes');
  const palettes = await response.json();
  return palettes;
};

const projectsWithPalettes = async () => {
  const projects = await getProjects();
  const colorPalettes = await getPalettes();
  const combinedProjectWithPalette = [];
  projects.forEach(project => {
    colorPalettes.forEach(colorPalette => {
      // console.log(project.name, palette.project_id);
      if (project.id === colorPalette.project_id) {
        combinedProjectWithPalette.push({
          title: project.name,
          name: colorPalette.name,
          color_1: colorPalette.color_1,
          color_2: colorPalette.color_2,
          color_3: colorPalette.color_3,
          color_4: colorPalette.color_4,
          color_5: colorPalette.color_5
        });
      }
    });
  });
  console.log(combinedProjectWithPalette);
};

projectsWithPalettes();

colorBlockSection.addEventListener('click', lockColor);
randomButton.addEventListener('click', setRandomColorPallet);