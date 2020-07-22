const express = require('express');
const ListingController = require('./controllers/ListingController');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());

var cors = require('cors');

app.use(cors());

app.post('/', async (req, res) => {
  const { url } = req.body;
  const result = await ListingController.fetchUrl(url);
  const { statusCode, error } = result;
  if (statusCode === 200) {
    res.json(result.data);
  } else {
    res.status(500).send('Server error');
    console.log(error.message);
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('app/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'app', 'build', 'index.html'))
  );
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('listening on port 5000'));
