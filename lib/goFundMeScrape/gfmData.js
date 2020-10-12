const axios = require('axios');
const cheerio = require('cheerio');

// const goFundMeURL = 'https://www.gofundme.com/c/act/oregon-fires';

//https://www.gofundme.com/c/act/oregon-fires
//https://www.gofundme.com/c/act/northern-california-fires
//https://www.gofundme.com/c/act/southern-california-fires
//https://www.gofundme.com/c/act/central-california-fires
//https://www.gofundme.com/c/act/washington-fires

async function scrapeGetDescription(url) {
  const html = await axios.get(url);
  const $ = await cheerio.load(html.data);

  const descriptions = [];
  $('.o-campaign-story').each(function (i) {
    descriptions[i] = $(this).text();
  });

  // console.log(descriptions[0]);
  return descriptions[0];
}
// scrapeGetDescription('https://www.gofundme.com/f/chaplain-leon-roman-fire-relief-st-helena-ca');

async function scrapeThing(url) {
  /*CREATE EVERYTHING OBJECT*/
  const everythingObjectArr = [];
  const html = await axios.get(url);
  const $ = await cheerio.load(html.data);

  // this is for making multiple requests in the future
  // let one = 'https://www.gofundme.com/c/act/oregon-fires';
  // let two = 'https://www.gofundme.com/c/act/northern-california-fires';
  // let three = 'https://www.gofundme.com/c/act/southern-california-fires';

  // const requestOne = axios.get(one);
  // const requestTwo = axios.get(two);
  // const requestThree = axios.get(three);

  // axios
  //   .all([requestOne, requestTwo, requestThree])
  //   .then(
  //     axios.spread((...responses) => {
  //       const responseOne = responses[0];
  //       const responseTwo = responses[1];
  //       const responseThree = responses[2];

  //       // use/access the results
  //       console.log(responseOne, responseTwo, responseThree);
  //       const whatever = [];
  //       whatever.push(responseOne, responseTwo, responseThree);
  //       console.log(whatever);
  //     })
  //   )
  //   .catch((errors) => {
  //     // react on errors.
  //     console.error(errors);
  //   });

  const funds = [];
  $('.show-for-medium').each(function (i) {
    funds[i] = $(this).text();
  });
  // console.log(funds);

  const titles = [];
  $('.fund-title.truncate-single-line.show-for-medium').each(function (i) {
    titles[i] = $(this).text();
  });
  // console.log(titles);

  const urls = [];
  $('.campaign-tile-img--contain').each(function (i) {
    urls[i] = $(this).attr('href');
  });
  // console.log(urls);

  const images = [];
  $('.campaign-tile-img--contain').each(function (i) {
    images[i] = $(this)
      .attr('style')
      .match(/\(.*?\)/g)
      .map((x) => x.replace(/[()]/g, ''));
  });
  // console.log(images);

  const locations = [];
  $('.fund-location').each(function (i) {
    locations[i] = $(this).text();
  });
  // console.log(locations);

  const descriptions = [];
  $('.fund-description').each(function (i) {
    descriptions[i] = $(this).text();
  });
  // console.log(descriptions.length);

  const lastDonations = [];
  $('.text-small').each(function (i) {
    lastDonations[i] = $(this).text();
  });

  /*REMOVE TITLE*/
  const removeTitle = funds.filter((a, i) => i % 2 === 1);
  // console.log(removeTitle);

  /*FILTER REGEX FOR DOLLAR AMOUNTS ONLY*/
  const dollarAmount = removeTitle.map((fund) => {
    const regexNumber = fund.match(/\$[-0-9.,]+[-0-9.,a-zA-Z]*\b/g);
    return regexNumber;
  });
  // console.log(dollarAmount);
  // console.log(dollarAmount.length);

  /*REMOVES NULL OF FROM CHUNKED ARRAY*/
  const removeNull = dollarAmount.filter((item) => {
    return item != null;
  });
  // console.log(removeNull);
  // console.log(removeNull.length);

  /*REMOVES NESTED ARRAY*/
  const merge = [].concat.apply([], removeNull);
  // console.log(merge.length);

  /*REMOVES DOLLAR SIGN AND CONVERTS TO NUMBER */
  const newMerge = merge.map((dollar) => {
    const number = dollar.replace(/[^0-9.-]+/g, '');
    return Number(number);
  });

  // console.log(newMerge.length);

  const currentAmount = newMerge.filter((a, i) => i % 2 === 0);
  // console.log(currentAmount.length);

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
  // console.log(combinedArray);

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

  const urlObjectPush = () => {
    const result = combinedArray[4].map(async (x, i) => {
      // everythingObjectArr[i].link_url = x;
      await scrapeGetDescription(x).then((data) => everythingObjectArr[i].location = data);
      return await Promise.all(result);
      
    });
  };

  // const arr = [1, 2, 3, 4, 5, 6, 7, 8];
  // const randomDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

  // const calc = async (n, i) => {
  //   const result = await scrapeGetDescription(n).then(everythingObjectArr[i].description = scrapeGetDescription(n));
  //   return result;
  // };

  // const urlObjectPush = async () => {
  //   const unresolvedPromises = combinedArray[4].map((n, i) => calc(n, i));
  //   return await Promise.all(unresolvedPromises);
  // };

  // asyncFunc();

  // const descriptionObjectPush = () => {
  //   combinedArray[5].map((x, i) => {
  //     everythingObjectArr[i].description = x;
  //   });
  // };

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
  urlObjectPush();
  locationObjectPush();
  // descriptionObjectPush();
  lastDonationObjectPush();
  imgURLObjectPush();

  // console.log(combinedArray[0]); //campaign title
  // console.log(combinedArray[1]); //amount raised
  // console.log(combinedArray[2]); //goal
  // console.log(combinedArray[3]); //location
  // console.log(combinedArray[4]); //link_url
  // console.log(combinedArray[5]); //description
  // console.log(combinedArray[6]); //last donated
  // console.log(combinedArray[7]); //will be image url
  console.log(everythingObjectArr);

  /*CALCULATE PERCENTAGE OF FUNDS RAISED*/
  const percentages = everythingObjectArr.map((item) => {
    const percent = (item.current_amount / item.goal) * 100;
    return Math.round(percent);
  });
  // console.log(percentages);
  /*ADD PERCENTAGES TO combinedArray*/
  combinedArray.push(percentages);
  // console.log(combinedArray[8]);

  const percentageObjectPush = () => {
    combinedArray[8].map((x, i) => {
      everythingObjectArr[i].percentage_raised = x;
    });
  };

  percentageObjectPush();

  return everythingObjectArr;
}

scrapeThing('https://www.gofundme.com/c/act/oregon-fires');

// const result = await scrapeGetDescription('https://www.gofundme.com/f/chaplain-leon-roman-fire-relief-st-helena-ca');

// console.log(result);

// scrapeGetDescription();


// scrapeThing();
module.exports = {
  scrapeThing,
};
