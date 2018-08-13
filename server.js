const express = require('express');

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.locals.title = 'Pallet Picker';

app.get('/', (request, response) => {
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});