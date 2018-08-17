const palette = {
  colors: [
    {
      color_1: null,
      saved: false
    }, {
      color_2: null,
      saved: false
    }, {
      color_3: null,
      saved: false
    }, {
      color_4: null,
      saved: false
    }, {
      color_5: null,
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

const clearAllChildNodes = node => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

const createMarkUpForProjectsWithPalettes = async () => {
  const projects = await getProjects();
  const colorPalettes = await getPalettes();
  const paletteSection = document.querySelector('.user-palettes');
  const select = document.querySelector('.select');
  clearAllChildNodes(paletteSection);
  clearAllChildNodes(select);

  const markupForUserPalette = project => `
  <article class="user-section__palette">
    <h3 class="user-section__palette--heading">${project.name}</h3>
    ${colorPalettes
    .map(
      paletteItem => paletteItem.project_id === project.id ? paletteMarkup(paletteItem) : null
    ).join('')}
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

  const sectionOption = title => `<option value=${title}>${title}</option>`;

  projects.forEach((project, index) => {
    select.innerHTML += sectionOption(project.name);
    paletteSection.innerHTML += markupForUserPalette(project);
  });
};

const postNewProject = async event => {
  event.preventDefault();
  const projectTitle = document.querySelector('.project-title');
  const options = {
    method: 'POST',
    body: JSON.stringify({ name: projectTitle.value }),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    await fetch('api/v1/projects', options);
    projectTitle.value = '';
    createMarkUpForProjectsWithPalettes();
  } catch (error) {
    return Error(`Error saving project: ${error}`);
  }
};

document.querySelector('.color-blocks').addEventListener('click', lockColor);
document.querySelector('.controls-section__button').addEventListener('click', setRandomColorPallet);
document.querySelector('.controls-section__from').addEventListener('submit', postNewProject);

createMarkUpForProjectsWithPalettes();