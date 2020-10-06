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
console.log(titles);

const urls = [];
$('.campaign-tile-img--contain').each(function (i, elem) {
  urls[i] = $(this).attr('href');
});
console.log(urls);

const images = [];
$('.campaign-tile-img--contain').each(function (i, elem) {
  images[i] = $(this)
    .attr('style')
    .match(/\(.*?\)/g)
    .map((x) => x.replace(/[()]/g, ''));
});
console.log(images);

const locations = [];
$('.fund-location').each(function (i, elem) {
  locations[i] = $(this).text();
});
console.log(locations);

const descriptions = [];
$('.fund-description').each(function (i, elem) {
  descriptions[i] = $(this).text();
});
console.log(descriptions);

const lastDonations = [];
$('.text-small').each(function (i, elem) {
  lastDonations[i] = $(this).text();
});
console.log(lastDonations);

/* EXAMPLE OF CHUNKING RETURNED DATA INTO NESTED ARRAY */
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
console.log(chunk(funds, 2));

/*CHUNKED ARRAY STORED AS VARIABLE*/
const chunkedArray = chunk(funds, 2);

/*EXAMPLE OF TAKING AN ARRAY OF ARRAYS AND TURNING IT INTO AN OBJECT WITH KEY VALUE PAIRS*/
const key = ['fundTitle', 'amountRaised'];

const result = chunkedArray.map((row) =>
  row.reduce((acc, cur, i) => ((acc[key[i]] = cur), acc), {})
);

console.log(result);

/*EXAMPLE OF TURNING THE RETURNED ARRAY INTO AN ARRAY OF ARRAYS*/
const dollarAmount = funds.map((fund) => {
  const regexNumber = fund.match(/\$[-0-9.,]+[-0-9.,a-zA-Z]*\b/g);
  return regexNumber;
});
console.log(dollarAmount);

/*REMOVES NULL OF FROM CHUNKED ARRAY*/
const removeNull = dollarAmount.filter((item) => {
  return item != null;
});
console.log(removeNull);

/*REMOVES NESTED ARRAY*/
const merge = [].concat.apply([], removeNull);
console.log(merge);

/*REMOVES DOLLAR SIGN AND CONVERTS TO NUMBER */
let newMerge = merge.map((dollar) => {
  const number = dollar.replace(/[^0-9.-]+/g, '');
  return Number(number);
});

console.log(newMerge);

// console.log(dollarAmount);

//sandbox newMerge
//need two arrays that we'll push 2 different sets of numbers into

const goalAmount = newMerge.filter((a, i) => i % 2 === 0);
console.log(goalAmount);

const currentAmount = newMerge.filter((a, i) => i % 2 === 1);
console.log(currentAmount);

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
// console.log(combinedArray2[2]);

// const key1 = ['fundTitle'];
// const key2 = ['fundUrl'];
// const key3 = ['image'];
// const key4 = ['location'];
// const key6 = ['description'];

// const newObject = combinedArray2.map((el) => {
//   const obj = {};
//   for (let i = 0; i < el.length; i++) {
//     obj[i] = el[i];
//   }
//   return obj;
// });

// console.log(newObject);

// const whatever = () => {
//   titles.map((x) => x.push({"campaignTitle": x}) {
//   return x;
// })
// };

let emptyThing1 = [];

combinedArray2[0].map((x) => {
  emptyThing1.push({
    campaign_name: x,
    current_amount: 0,
    goal: 0,
    location: null,
    img_url: null,
    link_url: null,
    description: null,
    last_donation: null,
  });
});

const currentAmountObjectPush = () => {
  combinedArray2[1].map((x, i) => {
    emptyThing1[i].current_amount = x;
  });
};

const goalAmountObjectPush = () => {
  combinedArray2[1].map((x, i) => {
    emptyThing1[i].goal = x;
  });
};

const locationObjectPush = () => {
  combinedArray2[3].map((x, i) => {
    emptyThing1[i].location = x;
  });
};

const urlObjectPush = () => {
  combinedArray2[4].map((x, i) => {
    emptyThing1[i].link_url = x;
  });
};

const descriptionObjectPush = () => {
  combinedArray2[5].map((x, i) => {
    emptyThing1[i].description = x;
  });
};

const lastDonationObjectPush = () => {
  combinedArray2[6].map((x, i) => {
    emptyThing1[i].last_donation = x;
  });
};

const imgURLObjectPush = () => {
  combinedArray2[7].flat().map((x, i) => {
    emptyThing1[i].img_url = x;
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
console.log(emptyThing1);

//create an object with all the things
//push each array into correct key

// const result1 = combinedArray2.map((row) =>
//   row.reduce((acc, cur, i) => ((acc[key1[i]] = cur), acc), {})
// );

// console.log(result1);

// // const obj2 = combineArray2.reduce((a,[val], key1) => {
// //  a[val] = key1;
// //  return a;
// // }, {});

// console.log(obj2);

// array = [
//   [1, 1, 1],
//   [2, 2, 2],
//   [3, 3, 3],
// ];
