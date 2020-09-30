const axios = require('axios');
const cheerio = require("cheerio");

async function fetchHTML(url) {
  const { data } = await axios.get(url)
  return cheerio.load(data)
}

/*Scrapes oregon-fire GFM for all divs with the class 'show-for-medium'). Returns array with name of fund, amount raised, and amount needed e.g. 'Frank and Jeanne Moore Wildfire Relief Fund',
  '$43,730 raised of $50,000',*/

const $ = await fetchHTML("https://www.gofundme.com/c/act/oregon-fires")

const funds = [];
$('.show-for-medium').each(function(i, elem) {
  funds[i] = $(this).text();
});

/*returns just dollar amounts from 'funds' array above or returns null if NaN*/

const dollerAmount = funds.map(fund => {
  const regexNumber = fund.match(/\$[-0-9.,]+[-0-9.,a-zA-Z]*\b/g)
  return regexNumber;
})

/*removes null from array*/

const removeNull = dollerAmount.filter(item => {
  return item != null
})

/*need to build function that removes $ and , the replace method in funciton below does not work*/

// const removeDollar = removeNull.map(dollar => {
//   const number = Number(dollar.replace(/[^0-9.-]+/g,""));
;
//   return number;
// });


// console.log(dollerAmount);



