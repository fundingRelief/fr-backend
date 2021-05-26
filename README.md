# fundingRelief Backend

Our idea is simple and builds on the incredible platform GoFundMe has already built. We wanted to create a space that let's people browse all of the current wildfire funds on the West Coast to learn more about about individuals and communities in need. You can can see detailed information about each fund and when you're ready can go directly to that funds GoFundMe page to donate. What makes our site a bit different is that we wanted to ensure funds that are the furthest from reaching their goal make it to the top of the page. That's why when you will always those who still need the most relief at the top of the page.

<a href='http://fundingrelief.netlify.app/'>Deployed Site</a>

## Getting started

1. Run `npm i` to install dependencies
1. Run `npm run setup-db` to re-seed database
1. Run `npm run start:watch` to start the dev server
1. Routes are in `app.js`, not in `server.js`. This is so our tests will not launch a server every time.
