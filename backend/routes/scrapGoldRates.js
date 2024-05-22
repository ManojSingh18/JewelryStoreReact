const axios = require('axios');
const cheerio = require('cheerio');

// const fetchGoldRate = async () => {
//   try {
//     const response = await axios.get('https://www.reliancejewels.com/');
//     const html = response.data;
//     // console.log("Response data holds:", html);
//     const $ = cheerio.load(html);
//     console.log("$ value is:", $);
    
//     // Adjust the selector based on the actual HTML structure
//     const goldRateElement = $('div[data-test="instrument-price-last"]').first();
    
//     if (goldRateElement.length === 0) {
//       console.error('Gold rate element not found');
//       return html;
//     }

//     const goldRate = goldRateElement.text().trim();
//     console.log(`Fetched gold rate: ${goldRate}`);
//     return goldRate;
//   } catch (error) {
//     console.error('Error fetching gold rate:', error.message);
//     return null;
//   }
// };

// module.exports = fetchGoldRate;


const fetchGoldRate = async () => {
  try {
    const response = await axios.get('https://reliancejewels.com/api/stores/getGoldRateList');
    const goldRate = response.data.data.goldRate[0];
    
    if (!goldRate) {
      console.error('Gold rates not found in API response');
      return null;
    }

    const goldRates = {
      '24KT': `${goldRate.amount_one.$numberDecimal} INR`,
      '22KT': `${goldRate.amount_two.$numberDecimal} INR`,
      '18KT': `${goldRate.amount_three.$numberDecimal} INR`,
      '14KT': `${goldRate.amount_four.$numberDecimal} INR`,
    };

    console.log('Fetched gold rates:', goldRates);
    return goldRates;
  } catch (error) {
    console.error('Error fetching gold rates:', error.message);
    return null;
  }
};

module.exports = fetchGoldRate;



// const puppeteer = require('puppeteer');

// const fetchGoldRate = async () => {
//   try {
//     // Launch a headless browser
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Navigate to the website
//     await page.goto('https://bhimagold.com', { waitUntil: 'networkidle2' });

//     // Wait for the parent element that contains the gold rates to be loaded
//     await page.waitForSelector('div._mq3qib'); // Adjust the selector to the parent container

//     // Extract the gold rates
//     const goldRates = await page.evaluate(() => {
//       const rates = {};
//       const rateElements = document.querySelectorAll('div._mq3qib p._888ycp');

//       rateElements.forEach((element) => {
//         const text = element.innerText;
//         if (text.includes('Gold Rate 24 KT')) {
//           rates['24KT'] = text.split(':')[1].trim();
//         } else if (text.includes('Gold Rate 22 KT')) {
//           rates['22KT'] = text.split(':')[1].trim();
//         } else if (text.includes('Gold Rate 18 KT')) {
//           rates['18KT'] = text.split(':')[1].trim();
//         } else if (text.includes('Silver Rate')) {
//           rates['Silver'] = text.split(':')[1].trim();
//         }
//       });

//       return rates;
//     });

//     // Close the browser
//     await browser.close();

//     // Check if any rates were found
//     if (Object.keys(goldRates).length === 0) {
//       console.error('Gold rates not found');
//       return null;
//     }

//     console.log('Fetched gold rates:', goldRates);
//     return goldRates;
//   } catch (error) {
//     console.error('Error fetching gold rates:', error.message);
//     return null;
//   }
// };

// module.exports = fetchGoldRate;





