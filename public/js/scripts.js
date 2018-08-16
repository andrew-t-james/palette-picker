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
  const getRandomHexColor = () => `#${Math.random().toString(16).slice(2, 8)}`;
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
  const combinedProjectsAndPalettes = colorPalettes.reduce((combined, currPalette) => {

    const project = projects.find(currProject => currProject.id === currPalette.project_id);
    const paletteByProject = colorPalettes.filter(colorPalette => colorPalette.project_id === project.id);

    if (project.id === currPalette.project_id) {
      combined[project.name] = paletteByProject;
    }
    return combined;
  }, {});

  return combinedProjectsAndPalettes;
};

const createMarkUpForProjectsWithPalettes = async () => {
  const paletteSection = document.querySelector('.user-palettes');
  const projectList = await projectsWithPalettes();
  const projectListKeys = Object.keys(projectList);
  const markupForUserPalette = (title, paletteList) => `
  <article class="user-section__palette">
    <h3 class="user-section__palette--heading">${title}</h3>
      ${paletteList.map(paletteItem => paletteMarkup(paletteItem)).join('')}
  </article>
  `;

  const paletteMarkup = newPalette => `
  <div class="user-section__palette--colors">
      <h4 class="user-section__palette--title">${newPalette.name}</h4>
      <div class="user-section__palette--colors-block" style="background: ${newPalette.color_2}"></div>
      <div class="user-section__palette--colors-block" style="background: ${newPalette.color_2}"></div>
      <div class="user-section__palette--colors-block" style="background: ${newPalette.color_3}"></div>
      <div class="user-section__palette--colors-block" style="background: ${newPalette.color_4}"></div>
      <div class="user-section__palette--colors-block" style="background: ${newPalette.color_5}"></div>
      <i class="fas fa-trash-alt"></i>
    </div>
    `;

  projectListKeys.forEach((project, index) => {
    const userPalette = projectList[project];
    paletteSection.innerHTML += markupForUserPalette(project, userPalette);
  });
};

createMarkUpForProjectsWithPalettes();

document.querySelector('.color-blocks').addEventListener('click', lockColor);
document.querySelector('.controls-section__button').addEventListener('click', setRandomColorPallet);