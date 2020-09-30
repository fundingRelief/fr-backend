
const axios = require('axios');
const cheerio = require("cheerio");

async function fetchHTML(url) {
  const { data } = await axios.get(url)
  return cheerio.load(data)
}

const $ = await fetchHTML("https://www.gofundme.com/c/act/oregon-fires")

// Print the full HTML
// console.log(`Site HTML: ${$.html()}\n\n`)

// Print some specific page content
// console.log(`Go fund me tag: ${$('div[class=show-for-medium]').html()}`) WORKS

// console.log(`Go fund me tag using nextAll selector: ${$('.show-for-medium').nextAll('strong')}`) /*WORKS RETURNS ALL FUNDS RAISED*/

// const funds = [];

// $('.show-for-medium').each(function(i, elem) {
//   funds[i] = $(this).text();
// });

// console.log(`These are the individual funds: ${funds.join(', ')}`); /*WORKS RETURNS FUND NAME & RAISED OF TOTAL*/


// console.log($('.show-for-medium').map(function(i, el) {
//   // this === el
//   return $(this).text();
// }).get().join(', '));  /*MAP FUNCTION WORKS, RETURNS FUND NAME, RAISED, TOTAL.*/

const obj1 = ($('.show-for-medium').map(function(i, el) {
  // this === el
  return $(this).text();
}))

console.log(obj1);

