const client = require('../lib/client');

run();

async function run() {
  try {
    await client.connect();
    await client.query(`       
                CREATE TABLE campaigns (
                    id SERIAL PRIMARY KEY NOT NULL,
                    campaign_name VARCHAR(512) NOT NULL,
                    current_amount INTEGER NOT NULL,
                    goal INTEGER NOT NULL,
                    percentage FLOAT NOT NULL,
                    donors INTEGER NOT NULL,
                    location VARCHAR(512),
                    img_url VARCHAR(600) NOT NULL,
                    link_url VARCHAR(600) NOT NULL,
                    description VARCHAR(2048) NOT NULL
            );
        `);

    console.log('create tables complete');
  } catch (err) {
    console.log(err);
  } finally {
    client.end();
  }
}
