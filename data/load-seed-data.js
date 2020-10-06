const client = require('../lib/client');
// const data = require('./data.json');
// const data = [];

const { scrapeThing } = require('../lib/goFundMeScrape/gfmData');

// scrapeThing();
// console.log(scrapeThing());

// (async () => {
//   console.log(await scrapeThing());
// })();

// const whatever = () => {
//   (async () => {
//     await scrapeThing();
//   })();
// };

// const data = scrapeThing().then((value) => value);

// whatever();

// const data = whatever();
// console.log(data);

run();

async function run() {
  try {
    const data = await scrapeThing(
      'https://www.gofundme.com/c/act/oregon-fires'
    );
    await client.connect();
    console.log(data);

    await Promise.all(
      data.map((campaign) => {
        return client.query(
          `
                    INSERT INTO campaigns (campaign_name, current_amount, goal, percentage_raised, location, img_url, link_url, description, last_donation, cause)
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
