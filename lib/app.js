const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

app.get('/campaigns', async (req, res) => {
  try {
    const data = await client.query('SELECT * from campaigns');

    res.json(data.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/campaigns', async (req, res) => {
  try {
    const {
      campaign_name,
      current_amount,
      goal,
      percentage,
      donors,
      location,
      img_url,
      link_url,
      description,
    } = req.body;

    const newListing = await client.query(
      `
          INSERT INTO air_listings (campaign_name, current_amount, goal, percentage, donors, location, img_url, link_url, description)
          values ($1, $2, $3, $4, $5, $6, $7, $8 $9)
          returning *
      `,
      [
        campaign_name,
        current_amount,
        goal,
        percentage,
        donors,
        location,
        img_url,
        link_url,
        description,
      ]
    );

    res.json(newListing.rows[0]);
  } catch (e) {
    console.error(e);
  }
});

app.use(require('./middleware/error'));

module.exports = app;
