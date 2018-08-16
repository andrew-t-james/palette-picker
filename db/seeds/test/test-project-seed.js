const projects = [{
  name: 'Dark Tones',
  palettes: [{
    name: 'Dark Colors',
    color_1: '#FFFFFF',
    color_2: '#1b263b',
    color_3: '#415a77',
    color_4: '#7b9e87',
    color_5: '#7b9e87'
  }, {
    name: 'Light Colors',
    color_1: '#2E294E',
    color_2: '#EFBCD5',
    color_3: '#BE97C6',
    color_4: '#8661C1',
    color_5: '#4B5267'
  }]
}, {
  name: 'Light Tones',
  palettes: [{
    name: 'Greens',
    color_1: '#DDE0BD',
    color_2: '#D0D1AC',
    color_3: '#B6A39E',
    color_4: '#948B89',
    color_5: '#726E75'
  }, {
    name: 'Blues',
    color_1: '#D7DAE5',
    color_2: '#B9CDDA',
    color_3: '#A6D8D4',
    color_4: '#8EAF9D',
    color_5: '#6B7F82'
  }]
}];

const createProject = (knex, project) => knex('projects').insert({
  name: project.name
}, 'id')
  .then(projectId => {
    const palettesPromise = [];

    project.palettes.forEach(palette => {
      palettesPromise.push(
        createPalette(knex, {
          ...palette,
          project_id: projectId[0]
        })
      );
    });

    return Promise.all(palettesPromise);
  });

const createPalette = (knex, palette) => knex('palettes').insert(palette);

exports.seed = (knex, Promise) => knex('palettes').del()
  .then(() => knex('projects').del())
  .then(() => {
    const projectsPromises = [];

    projects.forEach(project => {
      projectsPromises.push(createProject(knex, project));
    });

    return Promise.all(projectsPromises);
  })
  .catch(error => console.log(`Error seeding data: ${error}`));
