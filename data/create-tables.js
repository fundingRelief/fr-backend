const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {
  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`       
                CREATE TABLE campaigns (
                    id SERIAL PRIMARY KEY NOT NULL,
                    campaign_name VARCHAR(512) NOT NULL,
                    current_amount VARCHAR(512) NOT NULL,
                    goal VARCHAR(512) NOT NULL,
                    percentage VARCHAR(512)
                    donors INTEGER NOT NULL,
                    img_url VARCHAR(600) NOT NULL,
                    link_url VARCHAR(600) NOT NULL,
                    description VARCHAR(256) NOT NULL
            );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  } catch (err) {
    // problem? let's see the error...
    console.log(err);
  } finally {
    // success or failure, need to close the db connection
    client.end();
  }
}
