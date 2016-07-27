const express = require('express');
const router = express.Router();
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.get('/pegaVoos', function(req, res) {


  const BASE_URL = 'http://book.latam.com/TAM/dyn/air/redemption/availability;jsessionid=IOEqg0cEtdolNg6cA8SbHSb7Rq6QoxgX4272JUK9w7gpJlRHVCj_!-215252347!-94134157?B_DATE_1=201608020000&B_DATE_2=201608110000&B_LOCATION_1=CNF&LANGUAGE=BR&passenger_useMyPoints=true&WDS_MARKET=BR&children=0&E_LOCATION_1=BSB&SERVICE_ID=2&SITE=JJRDJJRD&COUNTRY_SITE=BR&WDS_AWARD_CORPORATE_CODE=&MARKETING_CABIN=E&adults=1&infants=0&TRIP_TYPE=R'
  request(BASE_URL, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      const voos = []
      let counter = 0;
      var $ = cheerio.load(html)
      $('[class*=" flightType"]').each(function(i, element){
        const voo = {}
        voo.de = $(this).children('.fromTh').text().trim()
        voo.para = $(this).children('.toTh').text().trim()
        voo.voo = $(this).children(".flightNumber").children("a").text()
        voo.duracao = $(this).children('.durationTh').text().trim()
        voo.promo = $(this).children('.ff-EPROMOD').text().trim()
        voo.classico = $(this).children('.ff-ECLASSICOD').text().trim()
        voo.irrestrito = $(this).children('.ff-EIRRESTRID').text().trim()
        // console.log('voo.voo', voo.voo)
        voos.push(voo)
        counter = i
      })
      res.render('voos', { voos: JSON.stringify(voos) });
      fs.writeFile('voos.json', JSON.stringify(voos), (err) => {
        if (err) throw err;
        console.log('salvos '+counter+' voos!')
      });
    }
  });
});

module.exports = router;
