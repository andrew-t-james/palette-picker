
exports.seed = (knex, Promise) =>
  // Deletes ALL existing entries
  knex('palettes')
    .del()
    .then(() => knex('projects').del()
      .then(() => Promise.all([
        knex('projects')
          .insert({
            name: 'My First Project'
          }, 'id')
          .then(project => knex('palettes').insert([
            {
              name: 'Project One',
              color_1: '#FFFFFF',
              color_2: '#FFFFFF',
              color_3: '#FFFFFF',
              color_4: '#FFFFFF',
              color_5: '#FFFFFF',
              project_id: project[0]
            },
            {
              name: 'Project Two',
              color_1: '#000000',
              color_2: '#000000',
              color_3: '#000000',
              color_4: '#000000',
              color_5: '#000000',
              project_id: project[0]
            }
          ]))
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]) .catch(error => console.log(`Error seeding data: ${error}`)))
    );
