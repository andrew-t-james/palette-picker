const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);


app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.locals.title = 'Pallet Picker';

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.get('/api/v1/projects', (req, res) => {
  database('projects').select()
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.get('/api/v1/palettes', (req, res) => {
  database('palettes').select()
    .then((palettes) => {
      res.status(200).json(palettes);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, res) => {
  const projectTitle = request.body;

  for (const requiredParameter of ['name']) {
    if (!projectTitle[requiredParameter]) {
      return res.status(422).json({
        error: `You are missing the required parameter ${requiredParameter}`
      });
    }
  }

  database('projects').insert(projectTitle, 'id')
    .then(newProject =>
      res.status(201).json({ id: newProject[0] })
    )
    .catch(error =>
      res.status(500).json({ error })
    );
});

app.delete('/api/v1/palettes/:id', (request, res) => {
  const { id } = request.body;

  database('palettes').where('id', id).del()
    .then(foundId => {
      if (!foundId) {
        return res.status(422).json({ error: 'That palette does not exist.' });
      }
      return res.sendStatus(204);
    })
    .catch((error) => res.status(500).json({ error }));
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;