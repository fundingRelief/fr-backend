const axios = require('axios');
const cheerio = require('cheerio');

// const goFundMeURL = 'https://www.gofundme.com/c/act/oregon-fires';

// /*FETCH CALL USING CHEERIO */
// async function $() {
//   const { data } = await axios.get(goFundMeURL);
//   return cheerio.load(data);
// }

// import axios from 'axios';
// import cheerio from 'cheerio';

async function scrapeThing() {
  /*CREATE EVERYTHING OBJECT*/
  const everythingObjectArr = [];
  const html = await axios.get('https://www.gofundme.com/c/act/oregon-fires');
  const $ = await cheerio.load(html.data);

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
  // console.log(goalAmount.length);

  /* Combine arrays into one large array using spread*/
  // const combinedArray = [
  //   ...titles,
  //   ...currentAmount,
  //   ...goalAmount,
  //   ...locations,
  //   ...urls,
  //   ...descriptions,
  //   ...lastDonations,
  //   ...images,
  // ];
  // console.log(`CombinedArray =` + combinedArray);
  // console.log(combinedArray);

  /*Combine array into a multidimensional array using push */
  const combinedArray2 = [];
  combinedArray2.push(
    titles,
    currentAmount,
    goalAmount,
    locations,
    urls,
    descriptions,
    lastDonations,
    images
  );
  // console.log(combinedArray2);

  combinedArray2[0].map((x) => {
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
      cause: 'oregon-fires',
    });
  });

  // const everythingPush = () => {
  //   combinedArray2.map((x, i) => {
  //     x.map((z, y) => {
  //       everythingObjectArr[y].current_amount = z[y];
  //       everythingObjectArr[y].goal = z[y];
  //       everythingObjectArr[y].location = z[y];
  //     });
  //   });
  // };
  // everythingPush();
  // console.log(everythingObjectArr);

  const currentAmountObjectPush = () => {
    combinedArray2[1].map((x, i) => {
      everythingObjectArr[i].current_amount = x;
    });
  };

  const goalAmountObjectPush = () => {
    combinedArray2[2].map((x, i) => {
      everythingObjectArr[i].goal = x;
    });
  };

  const locationObjectPush = () => {
    combinedArray2[3].map((x, i) => {
      everythingObjectArr[i].location = x;
    });
  };

  const urlObjectPush = () => {
    combinedArray2[4].map((x, i) => {
      everythingObjectArr[i].link_url = x;
    });
  };

  const descriptionObjectPush = () => {
    combinedArray2[5].map((x, i) => {
      everythingObjectArr[i].description = x;
    });
  };

  const lastDonationObjectPush = () => {
    combinedArray2[6].map((x, i) => {
      everythingObjectArr[i].last_donation = x;
    });
  };

  const imgURLObjectPush = () => {
    combinedArray2[7].flat().map((x, i) => {
      everythingObjectArr[i].img_url = x;
    });
  };

  /*CALL PUSH FUNCTIONS*/
  currentAmountObjectPush();
  goalAmountObjectPush();
  urlObjectPush();
  locationObjectPush();
  descriptionObjectPush();
  lastDonationObjectPush();
  imgURLObjectPush();

  // console.log(combinedArray2[0]); //campaign title
  // console.log(combinedArray2[1]); //amount raised
  // console.log(combinedArray2[2]); //goal
  // console.log(combinedArray2[3]); //location
  // console.log(combinedArray2[4]); //link_url
  // console.log(combinedArray2[5]); //description
  // console.log(combinedArray2[6]); //last donated
  // console.log(combinedArray2[7]); //will be image url
  // console.log(everythingObjectArr);

  /*CALCULATE PERCENTAGE OF FUNDS RAISED*/
  const percentages = everythingObjectArr.map((item) => {
    const percent = (item.current_amount / item.goal) * 100;
    return Math.round(percent);
  });
  // console.log(percentages);
  /*ADD PERCENTAGES TO combinedArray2*/
  combinedArray2.push(percentages);
  // console.log(combinedArray2[8]);

  const percentageObjectPush = () => {
    combinedArray2[8].map((x, i) => {
      everythingObjectArr[i].percentage_raised = x;
    });
  };

  percentageObjectPush();

  // console.log(combinedArray2[8]);
  // console.log(everythingObjectArr);

  // $('.site-main article').each((i, elem) => {
  //   if (i <= 3) {
  //     data.push({
  //       image: $(elem).find('img.wp-post-image').attr('src'),
  //       title: $(elem).find('h2.entry-title').text(),
  //       excerpt: $(elem).find('p.hide_xxs').text().trim(),
  //       link: $(elem).find('h2.entry-title a').attr('href')
  //     })
  //   }
  // });

  // console.log(data);
  // console.log(everythingObjectArr);

  return everythingObjectArr;
}

// scrapeThing();

(async () => {
  console.log(await scrapeThing());
})();

// (async () => {
//   console.log(await everythingObjectArr);
// })();
// console.log(everythingObjectArr);
// console.log(scrapeThing());

//https://www.gofundme.com/c/act/oregon-fires
//https://www.gofundme.com/c/act/northern-california-fires
//https://www.gofundme.com/c/act/southern-california-fires
//https://www.gofundme.com/c/act/central-california-fires
//https://www.gofundme.com/c/act/washington-fires

//URL STORED IN fetchHTML
//refactor this to make sense
// const $ = await fetchHTML('https://www.gofundme.com/c/act/oregon-fires');

// const $ = await fetchHTML(goFundMeURL);
// const $ = async () => {
//   await fetchHTML();
// };

//SCRAPED GFM INFO STORED IN AN ARRAY
// const funds = [];
// $('.show-for-medium').each(function (i, elem) {
//   funds[i] = $(this).text();
// });
// // console.log(funds);

// const titles = [];
// $('.fund-title.truncate-single-line.show-for-medium').each(function (i, elem) {
//   titles[i] = $(this).text();
// });
// // console.log(titles);

// const urls = [];
// $('.campaign-tile-img--contain').each(function (i, elem) {
//   urls[i] = $(this).attr('href');
// });
// // console.log(urls);

// const images = [];
// $('.campaign-tile-img--contain').each(function (i, elem) {
//   images[i] = $(this)
//     .attr('style')
//     .match(/\(.*?\)/g)
//     .map((x) => x.replace(/[()]/g, ''));
// });
// // console.log(images);

// const locations = [];
// $('.fund-location').each(function (i, elem) {
//   locations[i] = $(this).text();
// });
// // console.log(locations);

// const descriptions = [];
// $('.fund-description').each(function (i, elem) {
//   descriptions[i] = $(this).text();
// });
// // console.log(descriptions.length);

// const lastDonations = [];
// $('.text-small').each(function (i, elem) {
//   lastDonations[i] = $(this).text();
// });

/*EXAMPLE OF TURNING THE RETURNED ARRAY INTO AN ARRAY OF ARRAYS*/
// console.log(funds);

// /*REMOVE TITLE*/
// const removeTitle = funds.filter((a, i) => i % 2 === 1);
// // console.log(removeTitle);

// /*FILTER REGEX FOR DOLLAR AMOUNTS ONLY*/
// const dollarAmount = removeTitle.map((fund) => {
//   const regexNumber = fund.match(/\$[-0-9.,]+[-0-9.,a-zA-Z]*\b/g);
//   return regexNumber;
// });
// // console.log(dollarAmount);
// // console.log(dollarAmount.length);

// /*REMOVES NULL OF FROM CHUNKED ARRAY*/
// const removeNull = dollarAmount.filter((item) => {
//   return item != null;
// });
// // console.log(removeNull);
// // console.log(removeNull.length);

// /*REMOVES NESTED ARRAY*/
// const merge = [].concat.apply([], removeNull);
// // console.log(merge.length);

// /*REMOVES DOLLAR SIGN AND CONVERTS TO NUMBER */
// const newMerge = merge.map((dollar) => {
//   const number = dollar.replace(/[^0-9.-]+/g, '');
//   return Number(number);
// });

// // console.log(newMerge.length);

// const currentAmount = newMerge.filter((a, i) => i % 2 === 0);
// // console.log(currentAmount.length);

// const goalAmount = newMerge.filter((a, i) => i % 2 === 1);
// // console.log(goalAmount.length);

// /* Combine arrays into one large array using spread*/
// const combinedArray = [
//   ...titles,
//   ...currentAmount,
//   ...goalAmount,
//   ...locations,
//   ...urls,
//   ...descriptions,
//   ...lastDonations,
//   ...images,
// ];
// console.log(`CombinedArray =` + combinedArray);
// console.log(combinedArray);

// /*Combine array into a multidimensional array using push */
// const combinedArray2 = [];
// combinedArray2.push(
//   titles,
//   currentAmount,
//   goalAmount,
//   locations,
//   urls,
//   descriptions,
//   lastDonations,
//   images
// );
// console.log(combinedArray2);

// /*CREATE EVERYTHING OBJECT*/
// const everythingObjectArr = [];

// combinedArray2[0].map((x) => {
//   everythingObjectArr.push({
//     campaign_name: x,
//     current_amount: null,
//     goal: null,
//     percentage_raised: null,
//     location: null,
//     img_url: null,
//     link_url: null,
//     description: null,
//     last_donation: null,
//     cause: 'oregon-fires',
//   });
// });

// // const everythingPush = () => {
// //   combinedArray2.map((x, i) => {
// //     x.map((z, y) => {
// //       everythingObjectArr[y].current_amount = z[y];
// //       everythingObjectArr[y].goal = z[y];
// //       everythingObjectArr[y].location = z[y];
// //     });
// //   });
// // };
// // everythingPush();
// // console.log(everythingObjectArr);

// const currentAmountObjectPush = () => {
//   combinedArray2[1].map((x, i) => {
//     everythingObjectArr[i].current_amount = x;
//   });
// };

// const goalAmountObjectPush = () => {
//   combinedArray2[2].map((x, i) => {
//     everythingObjectArr[i].goal = x;
//   });
// };

// const locationObjectPush = () => {
//   combinedArray2[3].map((x, i) => {
//     everythingObjectArr[i].location = x;
//   });
// };

// const urlObjectPush = () => {
//   combinedArray2[4].map((x, i) => {
//     everythingObjectArr[i].link_url = x;
//   });
// };

// const descriptionObjectPush = () => {
//   combinedArray2[5].map((x, i) => {
//     everythingObjectArr[i].description = x;
//   });
// };

// const lastDonationObjectPush = () => {
//   combinedArray2[6].map((x, i) => {
//     everythingObjectArr[i].last_donation = x;
//   });
// };

// const imgURLObjectPush = () => {
//   combinedArray2[7].flat().map((x, i) => {
//     everythingObjectArr[i].img_url = x;
//   });
// };

// /*CALL PUSH FUNCTIONS*/
// currentAmountObjectPush();
// goalAmountObjectPush();
// urlObjectPush();
// locationObjectPush();
// descriptionObjectPush();
// lastDonationObjectPush();
// imgURLObjectPush();

// // console.log(combinedArray2[0]); //campaign title
// // console.log(combinedArray2[1]); //amount raised
// // console.log(combinedArray2[2]); //goal
// // console.log(combinedArray2[3]); //location
// // console.log(combinedArray2[4]); //link_url
// // console.log(combinedArray2[5]); //description
// // console.log(combinedArray2[6]); //last donated
// // console.log(combinedArray2[7]); //will be image url
// console.log(everythingObjectArr);

// /*CALCULATE PERCENTAGE OF FUNDS RAISED*/
// const percentages = everythingObjectArr.map((item, index) => {
//   const percent = (item.current_amount / item.goal) * 100;
//   return Math.round(percent);
// });
// console.log(percentages);
// /*ADD PERCENTAGES TO combinedArray2*/
// combinedArray2.push(percentages);
// console.log(combinedArray2[8]);

// const percentageObjectPush = () => {
//   combinedArray2[8].map((x, i) => {
//     everythingObjectArr[i].percentage_raised = x;
//   });
// };

// percentageObjectPush();

// console.log(combinedArray2[8]);
// console.log(everythingObjectArr);

// export function gfmDataFun() {
//   return everythingObjectArr;
// }
// console.log(gfmDataFun());
// module.exports = everythingObjectArr;
