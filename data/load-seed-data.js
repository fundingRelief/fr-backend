const client = require('../lib/client');
const data = require('./data.json');

run();

async function run() {
  try {
    await client.connect();

    await Promise.all(
      data.map((campaign) => {
        return client.query(
          `
                    INSERT INTO campaigns (campaign_name, current_amount, goal, percentage_raised, location, img_url, link_url, description, last_donation)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
                `,
          [
            campaign.campaign_name,
            campaign.current_amount,
            campaign.goal,
            campaign.percentage_raised,
            campaign.location,
            campaign.img_url,
            campaign.link_url,
            campaign.description,
            campaign.last_donation,
          ]
        );
      })
    );

    console.log('seed data load complete');
  } catch (err) {
    console.log(err);
  } finally {
    client.end();
  }
}
