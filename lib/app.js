const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

//return all campaigns in order stored
app.get('/campaigns', async (req, res) => {
  try {
    const data = await client.query('SELECT * from campaigns');

    res.json(data.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//return all campaigns by percentage
app.get('/campaigns/percentage', async (req, res) => {
  try {
    const result = await client.query(`
          SELECT *
          FROM campaigns
          ORDER BY percentage_raised
      `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || err,
    });
  }
});

//return oregon campaigns only by percentage
app.get('/campaigns/oregon', async (req, res) => {
  try {
    const result = await client.query(`
          SELECT *
          FROM campaigns
          WHERE cause = 'https://www.gofundme.com/c/act/oregon-fires'
          ORDER BY percentage_raised
      `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || err,
    });
  }
});

//return northern california campaigns only by percentage
app.get('/campaigns/nocal', async (req, res) => {
  try {
    const result = await client.query(`
          SELECT *
          FROM campaigns
          WHERE cause = 'https://www.gofundme.com/c/act/northern-california-fires'
          ORDER BY percentage_raised
      `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || err,
    });
  }
});

//return southern california campaigns only by percentage
app.get('/campaigns/socal', async (req, res) => {
  try {
    const result = await client.query(`
          SELECT *
          FROM campaigns
          WHERE cause = 'https://www.gofundme.com/c/act/southern-california-fires'
          ORDER BY percentage_raised
      `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || err,
    });
  }
});

//return central california campaigns only by percentage
app.get('/campaigns/centralca', async (req, res) => {
  try {
    const result = await client.query(`
          SELECT *
          FROM campaigns
          WHERE cause = 'https://www.gofundme.com/c/act/central-california-fires'
          ORDER BY percentage_raised
      `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || err,
    });
  }
});

//return washington campaigns only by percentage
app.get('/campaigns/washington', async (req, res) => {
  try {
    const result = await client.query(`
          SELECT *
          FROM campaigns
          WHERE cause = 'https://www.gofundme.com/c/act/washington-fires'
          ORDER BY percentage_raised
      `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || err,
    });
  }
});

app.get('/search', async (req, res) => {
  try {
    console.log(req.query.search);
    const result = await client.query(`
          SELECT * FROM campaigns
          WHERE campaign_name ILIKE '%${req.query.search}%'
          OR location ILIKE '%${req.query.search}%'
          OR description ILIKE '%${req.query.search}%'
      `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || err,
    });
  }
});

app.get('/campaigns/:campaignID', async (req, res) => {
  try {
    const result = await client.query(`
    SELECT *
    FROM campaigns
    WHERE id = ${req.params.campaignID}
    `);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || err,
    });
  }
});

app.post('/campaigns', async (req, res) => {
  try {
    const {
      campaign_name,
      current_amount,
      goal,
      percentage_raised,
      location,
      img_url,
      link_url,
      description,
      last_donation,
      cause,
    } = req.body;

    const newCampaign = await client.query(
      `
          INSERT INTO campaigns (campaign_name, current_amount, goal, percentage_raised, location, img_url, link_url, description, last_donation, cause)
          values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          returning *
      `,
      [
        campaign_name,
        current_amount,
        goal,
        percentage_raised,
        location,
        img_url,
        link_url,
        description,
        last_donation,
        cause,
      ]
    );

    res.json(newCampaign.rows[0]);
  } catch (e) {
    console.error(e);
  }
});

app.put('/campaigns/:campaignID', async (req, res) => {
  try {
    console.log(req.body);
    const result = await client.query(`
          UPDATE campaigns
          SET campaign_name = '${req.body.campaign_name}', 
          current_amount = '${req.body.current_amount}', 
          goal = '${req.body.goal}', 
          percentage_raised = '${req.body.percentage_raised}',
          location = '${req.body.location}',
          img_url = '${req.body.img_url}',
          link_url = '${req.body.link_url}',
          description = '${req.body.description}',
          last_donation ='${req.body.donation}',
          cause = '${req.body.cause}'
          
          WHERE id = ${req.params.campaignID};
      `);

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || 'error',
    });
  }
});

app.delete('/campaigns/:campaignID', async (req, res) => {
  try {
    const result = await client.query(`
      DELETE FROM campaigns
      WHERE id = ${req.params.campaignID};
      `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message || err,
    });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
