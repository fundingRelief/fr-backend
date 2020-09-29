const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {
  try {
    await client.connect();
    await client.query(`       
                CREATE TABLE campaigns (
                    id SERIAL PRIMARY KEY NOT NULL,
                    campaign_name VARCHAR(512) NOT NULL,
                    current_amount VARCHAR(512) NOT NULL,
                    goal VARCHAR(512) NOT NULL,
                    percentage VARCHAR(512) NOT NULL,
                    donors INTEGER NOT NULL,
                    img_url VARCHAR(600) NOT NULL,
                    link_url VARCHAR(600) NOT NULL,
                    description VARCHAR(2048) NOT NULL
            );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  } catch (err) {
    console.log(err);
  } finally {
    client.end();
  }
}
