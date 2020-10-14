const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeGetDescription(url) {
  const html = await axios.get(url);
  const $ = await cheerio.load(html.data);
  // const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

  const descriptions = [];
  $('.o-campaign-story').each(function (i) {
    descriptions[i] = $(this).text();
  });

  // await sleep (1000).then;
  // console.log("1 second");
  return descriptions[0];
}

async function scrapeThing(url) {
  /*CREATE EVERYTHING OBJECT*/
  const everythingObjectArr = [];
  const html = await axios.get(url);
  const $ = await cheerio.load(html.data);

  const funds = [];
  $('.show-for-medium').each(function (i) {
    funds[i] = $(this).text();
  });

  const titles = [];
  $('.fund-title.truncate-single-line.show-for-medium').each(function (i) {
    titles[i] = $(this).text();
  });

  const urls = [];
  $('.campaign-tile-img--contain').each(function (i) {
    urls[i] = $(this).attr('href');
  });

  const images = [];
  $('.campaign-tile-img--contain').each(function (i) {
    images[i] = $(this)
      .attr('style')
      .match(/\(.*?\)/g)
      .map((x) => x.replace(/[()]/g, ''));
  });

  const locations = [];
  $('.fund-location').each(function (i) {
    locations[i] = $(this).text();
  });

  const descriptions = [];
  $('.fund-description').each(function (i) {
    descriptions[i] = $(this).text();
  });

  const lastDonations = [];
  $('.text-small').each(function (i) {
    lastDonations[i] = $(this).text();
  });

  //Dollar amount munging functions
  /*REMOVE TITLE*/
  const removeTitle = funds.filter((a, i) => i % 2 === 1);

  /*FILTER REGEX TO RETURN DOLLAR AMOUNTS ONLY*/
  const dollarAmount = removeTitle.map((fund) => {
    const regexNumber = fund.match(/\$[-0-9.,]+[-0-9.,a-zA-Z]*\b/g);
    return regexNumber;
  });

  /*REMOVES NULL OF FROM CHUNKED ARRAY*/
  const removeNull = dollarAmount.filter((item) => {
    return item != null;
  });

  /*REMOVES NESTED ARRAY*/
  const merge = [].concat.apply([], removeNull);

  /*REMOVES DOLLAR SIGN AND CONVERTS TO NUMBER */
  const newMerge = merge.map((dollar) => {
    const number = dollar.replace(/[^0-9.-]+/g, '');
    return Number(number);
  });

  const currentAmount = newMerge.filter((a, i) => i % 2 === 0);

  const goalAmount = newMerge.filter((a, i) => i % 2 === 1);

  /*Combine array into a multidimensional array using push */
  const combinedArray = [];
  combinedArray.push(
    titles,
    currentAmount,
    goalAmount,
    locations,
    urls,
    descriptions,
    lastDonations,
    images
  );

  //create the initial objects and put the campaign_name in them from the array of arrays (combinedArray)
  combinedArray[0].map((x) => {
    everythingObjectArr.push({
      campaign_name: x,
      current_amount: null,
      goal: null,
      percentage_raised: null,
      location: null,
      img_url: null,
      link_url: null,
      description: null,
      last_donation: null,
      cause: url,
    });
  });

  //put everything where it needs to go in the object
  const currentAmountObjectPush = () => {
    combinedArray[1].map((x, i) => {
      everythingObjectArr[i].current_amount = x;
    });
  };

  const goalAmountObjectPush = () => {
    combinedArray[2].map((x, i) => {
      everythingObjectArr[i].goal = x;
    });
  };

  const locationObjectPush = () => {
    combinedArray[3].map((x, i) => {
      everythingObjectArr[i].location = x;
    });
  };

  const urlAndDescriptionObjectPush = () => {
    const promises = combinedArray[4].map(async (x, i) => {
      everythingObjectArr[i].link_url = x;
      return scrapeGetDescription(x).then((data) => everythingObjectArr[i].description = data).catch((error) => {
        console.error(error);
      });
    });
    return Promise.all(promises).finally(() => console.log(everythingObjectArr));
  };
    
  const lastDonationObjectPush = () => {
    combinedArray[6].map((x, i) => {
      everythingObjectArr[i].last_donation = x;
    });
  };

  const imgURLObjectPush = () => {
    combinedArray[7].flat().map((x, i) => {
      everythingObjectArr[i].img_url = x;
    });
  };

  /*CALL PUSH FUNCTIONS*/
  currentAmountObjectPush();
  goalAmountObjectPush();
  locationObjectPush();
  lastDonationObjectPush();
  imgURLObjectPush();
  urlAndDescriptionObjectPush();

  // urlAndDescriptionObjectPush('https://www.gofundme.com/f/chaplain-leon-roman-fire-relief-st-helena-ca');
  // console.log(everythingObjectArr);

  //percentages functions
  /*CALCULATE PERCENTAGE OF FUNDS RAISED*/

  const percentages = everythingObjectArr.map((item) => {
    const percent = (item.current_amount * 100) / item.goal;
    return Math.round(percent);
  });
  /*ADD PERCENTAGES TO combinedArray*/
  combinedArray.push(percentages);

  const percentageObjectPush = () => {
    combinedArray[8].map((x, i) => {
      everythingObjectArr[i].percentage_raised = x;
    });
  };

  percentageObjectPush();

  return everythingObjectArr;
}

// uncomment and feed this a url to test a grab from a list of campaigns
// scrapeThing('https://www.gofundme.com/c/act/northern-california-fires');

module.exports = {
  scrapeThing,
};
