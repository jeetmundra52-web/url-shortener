require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const linksRouter = require('./routes/links');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/links', linksRouter);

// quick redirect convenience (optional): GET /:alias -> returns JSON meta or instructs a client to handle
app.get('/r/:alias', async (req, res) => {
  // a simple message for direct browser calls
  res.send(`<html><body>
    <script>
      // If someone opens short link directly in browser, redirect to frontend redirect page which handles password
      window.location.href = '${process.env.BASE_URL}/r/${req.params.alias}';
    </script>
  </body></html>`);
});

async function start() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/urlshortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Mongo connected');

  app.listen(PORT, () => console.log('Server running on', PORT));
}

start().catch(err => console.error(err));
