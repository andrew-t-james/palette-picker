const express = require('express'); // require express module
const bodyParser = require('body-parser'); // require body-parser module

const app = express(); // assign app the value of an express instance

const environment = process.env.NODE_ENV || 'development'; // set environment
const configuration = require('./knexfile')[environment]; // require knexfile setup based on enviroment
const database = require('knex')(configuration); // requires knex and pass the configuration


app.set('port', process.env.PORT || 3000); // set the port
app.use(bodyParser.json()); // set up app to user body parser
app.use(bodyParser.urlencoded({ extended: true })); // more body parser config
app.use(express.static('public')); // set up app to server the public dir

app.locals.title = 'Pallet Picker'; // set the title of the app

app.get('/', (req, res) => { // route to serve index.html from ./public
  res.sendFile('index.html'); // send index.html to client
});

app.get('/api/v1/projects', (req, res) => { // enpoint to GET all projects from database
  database('projects').select() // select projects table in database
    .then((projects) => res.status(200).json(projects)) // sends json response of projects from database
    .catch((error) => res.status(500).json({ error }));  // sends json response with error
});

app.get('/api/v1/palettes', (req, res) => { // enpoint to GET all palettes from database
  database('palettes').select()
    .then((palettes) => res.status(200).json(palettes)) // sends json response of palettes from database
    .catch((error) => res.status(500).json({ error })); // sends json response with error
});

app.post('/api/v1/projects', (req, res) => { // Setting enpoint to POST a new project to database
  const projectTitle = req.body; // assign projectTitle to the value of the req.body

  for (const requiredParameter of ['name']) { // check to see if required parameters are present
    if (!projectTitle[requiredParameter]) { // if requiredParameter is not present send back a 422 error
      return res.status(422).json({
        error: `You are missing the required parameter ${requiredParameter}`
      });
    }
  }

  database('projects').insert(projectTitle, 'id')
    .then(newProject => res.status(201).json({ id: newProject[0] })) // sends 201 successfully saved and json with id
    .catch(error => res.status(500).json({ error })); // sends back an error of 500 internal server error
});

app.post('/api/v1/palette', (req, res) => {
  const palette = { // assign palette to the value of the req.body
    ...req.body
  };

  for (const requiredParameter of ['project_id', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5', 'name']) {
    if (!palette[requiredParameter]) { // check for requiredParameters if not present send a 422 error
      return res.status(422).json({
        error: `You are missing the ${requiredParameter} property.`
      });
    }
  }
  database('palettes').insert(palette, '*') // insert all parameters user * in to palettes table
    .then(newPalette => res.status(201).json(newPalette)) // send back 201 successfully saved and json of newPalette
    .catch(error => res.status(500).json({ error })); // sends back an error of 500 internal server error
});

app.delete('/api/v1/palettes', (req, res) => { // Setting enpoint to DELETE a palette from database
  const { id } = req.body; // destructure the id from the req.body

  database('palettes').where('id', id).del() // select on palettes where id === id
    .then(foundId => {
      if (!foundId) { // if !foundId return 422 error and json error messages
        return res.status(422).json({ error: 'That palette does not exist.' });
      }
      return res.sendStatus(204); // send status of 204 successfully processed the request but nothing to send back
    })
    .catch((error) => res.status(500).json({ error })); // send 500 internal server error on error
});

app.listen(app.get('port'), () => { // set port
  console.log(`${app.locals.title} is running on ${app.get('port')}.`); // message to know what port server is on
});

module.exports = app; // export app for testing