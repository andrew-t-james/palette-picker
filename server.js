const express = require('express');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.locals.title = 'Pallet Picker';
app.locals.pallet = ['#0d1b2a', '#1b263b', '#415a77', '#7b9e87', '#e0e1dd'];

app.get('/', (request, response) => {
});

app.get('/api/v1/pallet', (req, res) => {
  const { pallet } = app.locals;

  res.json({ pallet });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});