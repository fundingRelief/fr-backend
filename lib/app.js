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

    const newCampaign = await client.query(
      `
          INSERT INTO campaigns (campaign_name, current_amount, goal, percentage, donors, location, img_url, link_url, description)
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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

    res.json(newCampaign.rows[0]);
  } catch (e) {
    console.error(e);
  }
});

app.put('/campaigns/:campaignID', async (req, res) => {
  // using req.body instead of req.params or req.query (which belong to /GET requests)
  try {
    console.log(req.body);
    const result = await client.query(`
          UPDATE campaigns
          SET campaign_name = '${req.body.campaign_name}', 
          current_amount = '${req.body.current_amount}', 
          goal = '${req.body.goal}', 
          percentage = '${req.body.percentage}',
          donors = '${req.body.donors}',
          location = '${req.body.location}',
          img_url = '${req.body.img_url}',
          link_url = '${req.body.link_url}',
          description = '${req.body.description}'
          
          WHERE id = ${req.params.campaignID};
      `);

    res.json(result.rows[0]); // return just the first result of our query
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || 'error',
    });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
