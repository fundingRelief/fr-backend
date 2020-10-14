const client = require('../../../lib/client');

const { scrapeThing } = require('../../../lib/goFundMeScrape/gfmData');

run();

async function run() {
  try {
    const data = await scrapeThing(
      'https://www.gofundme.com/c/act/southern-california-fires'
    );

    await client.connect();
    console.log('pushing into db');

    await Promise.all(
      data.map((campaign) => {
        return client.query(
          `
                    INSERT INTO campaigns_so_cal (campaign_name, current_amount, goal, percentage_raised, location, img_url, link_url, description, last_donation, cause)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
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
            campaign.cause,
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
