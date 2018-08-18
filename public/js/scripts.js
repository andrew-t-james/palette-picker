const palette = {
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

const setRandomColorPallet = event => {
  const getRandomHexColor = () => `#${Math.random().toString(16).slice(2, 8)}`;
  const colorBlockList = document.querySelectorAll('.color-blocks__block');
  const hexColorValue = document.querySelectorAll('.color-blocks__hex-color');
  if (event.keyCode === 32) {
    colorBlockList.forEach((block, index) => {
      if (!palette.colors[index].saved) {
        const newHexColor = getRandomHexColor();
        palette.colors[index][`color_${index + 1}`] = newHexColor;
        hexColorValue[index].innerText = newHexColor;
        block.setAttribute('style', `--color-${index + 1}: ${newHexColor}`);
      }
    });
  }
};

const lockColor = event => {
  if (event.target.tagName === 'I') {
    const hexCode = event.target.parentNode.getElementsByTagName('P')[0].innerText;
    const locked = palette.colors.find((hex, index) => hex[`color_${index + 1}`] === hexCode);
    const lockButton = event.target;
    locked.saved = !locked.saved;
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
  <article class='user-section__palette'>
    <h3 class='user-section__palette--heading'>${project.name}</h3>
    ${colorPalettes
    .map(
      paletteItem => paletteItem.project_id === project.id ? paletteMarkup(paletteItem) : null
    ).join('')}
  </article>
  `;

  const paletteMarkup = newPalette => `
  <div class='user-section__palette--colors' id='${newPalette.id}'>
      <h4 class='user-section__palette--title'>${newPalette.name}</h4>
      <div class='user-section__palette--colors-block' style='background: ${newPalette.color_2}'></div>
      <div class='user-section__palette--colors-block' style='background: ${newPalette.color_2}'></div>
      <div class='user-section__palette--colors-block' style='background: ${newPalette.color_3}'></div>
      <div class='user-section__palette--colors-block' style='background: ${newPalette.color_4}'></div>
      <div class='user-section__palette--colors-block' style='background: ${newPalette.color_5}'></div>
      <i class='fas fa-trash-alt'></i>
    </div>
    `;

  const sectionOption = project => `<option id=${project.id}>${project.name}</option>`;

  projects.forEach((project, index) => {
    select.innerHTML += sectionOption(project);
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

const createPalette = async event => {
  event.preventDefault();
  const optionElement = document.querySelector('.select');
  const paletteTitle = document.querySelector('.palette-title');
  const { id } = optionElement[optionElement.selectedIndex];
  const paletteColors = palette.colors.reduce((newColor, color, index) => {
    if (!newColor[color[`color_${index + 1}`]]) {
      newColor[`color_${index+1}`] = color[`color_${index + 1}`];
    }
    return newColor;
  }, {});

  const newPalette = {
    ...paletteColors,
    project_id: Number(id),
    name: paletteTitle.value
  };

  const savedColors = palette.colors.every(color => color.saved);

  if (!savedColors) {
    showErrorMessage('Please select 5 colors');
    return;
  }

  if (paletteTitle.value === '') {
    showErrorMessage('Please add a title to your Palette');
    return;
  }

  const options = {
    method: 'POST',
    body: JSON.stringify({ ...newPalette }),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    await fetch('/api/v1/palette', options);
    paletteTitle.value = '';
    palette.colors.map(color => color.saved = false);
    document.querySelectorAll('.fa-lock').forEach(lock => lock.classList.add('fa-lock-open'));
    createMarkUpForProjectsWithPalettes();
  } catch (error) {
    return Error(`Error saving project: ${error}`);
  }
};

const deletePalette = async event => {
  const { id } = event.target.parentNode;
  const options = {
    method: 'DELETE',
    body: JSON.stringify({ id }),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (event.target.tagName === 'I') {
    try {
      await fetch('/api/v1/palettes', options);
      createMarkUpForProjectsWithPalettes();
    } catch (error) {
      return Error(`Error saving project: ${error}`);
    }
  }
};

const showErrorMessage = message => {
  const snackBar = document.getElementById('snack-bar');
  snackBar.className = 'show';
  snackBar.innerText = message;
  setTimeout(() => { snackBar.className = snackBar.className.replace('show', ''); }, 3000);
};

document.querySelector('.color-blocks').addEventListener('click', lockColor);
document.querySelector('.controls-section__from').addEventListener('submit', postNewProject);
document.querySelector('.user-palettes').addEventListener('click', deletePalette);
document.querySelector('.save-palette-button').addEventListener('click', createPalette);
document.querySelector('body').addEventListener('keypress', setRandomColorPallet);
createMarkUpForProjectsWithPalettes();