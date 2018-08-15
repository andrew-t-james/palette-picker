const projects = [{
  name: 'My First Project',
  palettes: [{
    name: 'Palette One',
    color_1: '#FFFFFF',
    color_2: '#FFFFFF',
    color_3: '#FFFFFF',
    color_4: '#FFFFFF',
    color_5: '#FFFFFF'
  }, {
    name: 'Palette Two',
    color_1: '#000000',
    color_2: '#000000',
    color_3: '#000000',
    color_4: '#000000',
    color_5: '#000000'
  }]
}, {
  name: 'My Second Project',
  palettes: [{
    name: 'Palette One',
    color_1: '#000000',
    color_2: '#000000',
    color_3: '#000000',
    color_4: '#000000',
    color_5: '#000000'
  }, {
    name: 'Palette Two',
    color_1: '#FFFFFF',
    color_2: '#FFFFFF',
    color_3: '#FFFFFF',
    color_4: '#FFFFFF',
    color_5: '#FFFFFF'
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
