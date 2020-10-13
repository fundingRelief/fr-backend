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
    const result = await client.query(`
        SELECT * FROM (
          SELECT * FROM campaigns_oregon UNION ALL 
          SELECT * FROM campaigns_no_cal UNION ALL 
          SELECT * FROM campaigns_so_cal UNION ALL 
          SELECT * FROM campaigns_central_cal UNION ALL 
          SELECT * FROM campaigns_washington) 
          as all_campaigns
        ORDER BY percentage_raised
    `);

    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//return all campaigns by percentage
app.get('/campaigns/percentage', async (req, res) => {
  try {
    const result = await client.query(`
        SELECT * FROM (
          SELECT * FROM campaigns_oregon UNION ALL 
          SELECT * FROM campaigns_no_cal UNION ALL 
          SELECT * FROM campaigns_so_cal UNION ALL 
          SELECT * FROM campaigns_central_cal UNION ALL 
          SELECT * FROM campaigns_washington) 
          as all_campaigns
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
          FROM campaigns_oregon
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
          FROM campaigns_no_cal
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
          FROM campaigns_so_cal
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
app.get('/campaigns/centralcal', async (req, res) => {
  try {
    const result = await client.query(`
          SELECT *
          FROM campaigns_central_cal
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
          FROM campaigns_washington
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
        SELECT * FROM (
          SELECT * FROM campaigns_oregon UNION ALL 
          SELECT * FROM campaigns_no_cal UNION ALL 
          SELECT * FROM campaigns_so_cal UNION ALL 
          SELECT * FROM campaigns_central_cal UNION ALL 
          SELECT * FROM campaigns_washington) 
          as all_campaigns
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
    SELECT * FROM (
      SELECT * FROM campaigns_oregon UNION ALL 
      SELECT * FROM campaigns_no_cal UNION ALL 
      SELECT * FROM campaigns_so_cal UNION ALL 
      SELECT * FROM campaigns_central_cal UNION ALL 
      SELECT * FROM campaigns_washington) 
      as all_campaigns
    WHERE all_campaigns.id = ${req.params.campaignID}
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
