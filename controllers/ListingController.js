const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');

const BASE_URL = 'https://renthub.in.th';

exports.fetchUrl = async (url) => {
  const listings = [];
  const pages = [];

  const updateListings = (i, el) => {
    const $ = cheerio.load(el);
    const title = $('.name a').text();
    let price = $('.price_box div .price').text();
    price = price.replace(/\,/g, '');
    const size = `${$('.size .values').text()}`;
    const roomType = $('.room_type .values').text();
    const link = `${BASE_URL}${$('.listing_info .name a').attr('href')}`;
    const img = $('img').attr('src');
    listings.push({
      title,
      price,
      size,
      link,
      roomType,
      img,
    });
  };

  try {
    const res = await axios.get(url);

    const $ = cheerio.load(res.data);
    const title = $('.condo_project_brief .condo_name').text();
    console.log(title);
    const altTitle = $('.condo_project_brief .project_other_names').text();
    const address = $('.condo_project_brief .condo_address').text();
    $('.result_panel li').each(updateListings);

    $('.pagination a').each((i, el) => {
      const $ = cheerio.load(el);
      const page = $('a').attr('href');
      pages.push(page);
    });

    try {
      await Promise.all(
        pages.map(async (p) => {
          const pageUrl = encodeURI(`${BASE_URL}${p}`);
          const res = await axios.get(pageUrl);
          const $ = cheerio.load(res.data);
          $('.result_panel li').each(updateListings);
        })
      );
    } catch (error) {
      console.log(error.message);
    }

    return {
      statusCode: 200,
      data: {
        listings: listings,
        info: {
          title,
          altTitle,
          address,
        },
      },
    };
  } catch (e) {
    return {
      statusCode: 500,
      error: e,
    };
  }
};
