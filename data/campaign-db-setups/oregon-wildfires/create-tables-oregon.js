const client = require('../../../lib/client');

run();

async function run() {
  try {
    await client.connect();
    await client.query(`      
                CREATE TABLE campaigns_oregon (
                    id SERIAL PRIMARY KEY NOT NULL,
                    campaign_name VARCHAR(512) NOT NULL,
                    current_amount INTEGER NOT NULL,
                    goal INTEGER NOT NULL,
                    percentage_raised INTEGER NOT NULL,
                    location VARCHAR(512),
                    img_url VARCHAR(600) NOT NULL,
                    link_url VARCHAR(600) NOT NULL,
                    description VARCHAR(16384),
                    last_donation VARCHAR(512),
                    cause VARCHAR(512)
            );
            ALTER SEQUENCE campaigns_oregon_id_seq RESTART WITH 1000;
        `);

    console.log('create tables complete');
  } catch (err) {
    console.log(err);
  } finally {
    client.end();
  }
}
