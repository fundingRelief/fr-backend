const axios = require('axios');
const cheerio = require('cheerio');

/*FETCH CALL USING CHEERIO */
async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

/*Scrapes oregon-fire GFM for all divs with the class 'show-for-medium'). Returns array with name of fund, amount raised, and amount needed e.g. 'Frank and Jeanne Moore Wildfire Relief Fund',
  '$43,730 raised of $50,000',*/

//URL STORED IN fetchHTML
const $ = await fetchHTML('https://www.gofundme.com/c/act/oregon-fires');

//SCRAPED GFM INFO STORED IN AN ARRAY
const funds = [];
$('.show-for-medium').each(function (i, elem) {
  funds[i] = $(this).text();
});
console.log(funds);

const titles = [];
$('.fund-title.truncate-single-line.show-for-medium').each(function (i, elem) {
  titles[i] = $(this).text();
});
// console.log(titles);

const urls = [];
$('.campaign-tile-img--contain').each(function (i, elem) {
  urls[i] = $(this).attr('href');
});
// console.log(urls);

const images = [];
$('.campaign-tile-img--contain').each(function (i, elem) {
  images[i] = $(this)
    .attr('style')
    .match(/\(.*?\)/g)
    .map((x) => x.replace(/[()]/g, ''));
});
// console.log(images);

const locations = [];
$('.fund-location').each(function (i, elem) {
  locations[i] = $(this).text();
});
// console.log(locations);

const descriptions = [];
$('.fund-description').each(function (i, elem) {
  descriptions[i] = $(this).text();
});
// console.log(descriptions.length);

const lastDonations = [];
$('.text-small').each(function (i, elem) {
  lastDonations[i] = $(this).text();
});
// console.log(lastDonations);

/* EXAMPLE OF CHUNKING RETURNED DATA INTO NESTED ARRAY */
// const chunk = (arr, size) =>
//   Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
//     arr.slice(i * size, i * size + size)
//   );
// console.log(chunk(funds, 2));

/*CHUNKED ARRAY STORED AS VARIABLE*/
// const chunkedArray = chunk(funds, 2);

/*EXAMPLE OF TAKING AN ARRAY OF ARRAYS AND TURNING IT INTO AN OBJECT WITH KEY VALUE PAIRS*/
// const key = ['fundTitle', 'amountRaised'];

// const result = chunkedArray.map((row) =>
//   row.reduce((acc, cur, i) => ((acc[key[i]] = cur), acc), {})
// );

// console.log(result);

/*EXAMPLE OF TURNING THE RETURNED ARRAY INTO AN ARRAY OF ARRAYS*/
console.log(funds);

/*REMOVE TITLE*/
const removeTitle = funds.filter((a, i) => i % 2 === 1);
console.log(removeTitle);

/*FILTER REGEX FOR DOLLAR AMOUNTS ONLY*/
const dollarAmount = removeTitle.map((fund) => {
  const regexNumber = fund.match(/\$[-0-9.,]+[-0-9.,a-zA-Z]*\b/g);
  return regexNumber;
});
console.log(dollarAmount);
console.log(dollarAmount.length);

/*REMOVES NULL OF FROM CHUNKED ARRAY*/
const removeNull = dollarAmount.filter((item) => {
  return item != null;
});
console.log(removeNull);
console.log(removeNull.length);

/*REMOVES NESTED ARRAY*/
const merge = [].concat.apply([], removeNull);
console.log(merge.length);

/*REMOVES DOLLAR SIGN AND CONVERTS TO NUMBER */
let newMerge = merge.map((dollar) => {
  const number = dollar.replace(/[^0-9.-]+/g, '');
  return Number(number);
});

console.log(newMerge.length);

// console.log(dollarAmount);

//sandbox newMerge
//need two arrays that we'll push 2 different sets of numbers into

const currentAmount = newMerge.filter((a, i) => i % 2 === 0);
//added this .pop to make the thing go, but we need to narrow down why it's returning a .length of 226 instead of 225
// currentAmount.pop();
console.log(currentAmount.length);

const goalAmount = newMerge.filter((a, i) => i % 2 === 1);
console.log(goalAmount.length);

/* Combine arrays into one large array using spread*/
const combinedArray = [
  ...titles,
  ...currentAmount,
  ...goalAmount,
  ...locations,
  ...urls,
  ...descriptions,
  ...lastDonations,
  ...images,
];
console.log(`CombinedArray =` + combinedArray);
console.log(combinedArray);

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
console.log(combinedArray2[2]);

/*CREATE EVERYTHING OBJECT*/
const everythingObjectArr = [];

combinedArray2[0].map((x) => {
  everythingObjectArr.push({
    campaign_name: x,
    current_amount: null,
    goal: null,
    location: null,
    img_url: null,
    link_url: null,
    description: null,
    last_donation: null,
  });
});

const currentAmountObjectPush = () => {
  combinedArray2[1].map((x, i) => {
    everythingObjectArr[i].current_amount = x;
  });
};

const goalAmountObjectPush = () => {
  combinedArray2[2].map((x, i) => {
    // combinedArray2[2].map((x, i) => { //this is the what the code SHOULD be, but it says 'cannot set property 'goal' of undefined'
    // console.log(combinedArray2[2]);
    everythingObjectArr[i].goal = x;
  });
};
//if you console.log(combinedArray2[2]); you see everything though, I'm thinking there's just too many entries in it for it to map properly.
console.log(combinedArray2[2]);

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

currentAmountObjectPush();
goalAmountObjectPush();
urlObjectPush();
locationObjectPush();
descriptionObjectPush();
lastDonationObjectPush();
imgURLObjectPush();

console.log(combinedArray2[0]); //campaign title
console.log(combinedArray2[1]); //amount raised
console.log(combinedArray2[2]); //goal
console.log(combinedArray2[3]); //location
console.log(combinedArray2[4]); //link_url
console.log(combinedArray2[5]); //description
console.log(combinedArray2[6]); //last donated
console.log(combinedArray2[7]); //will be image url
console.log(everythingObjectArr);

