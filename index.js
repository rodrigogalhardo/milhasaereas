const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

const BASE_URL = 'http://book.latam.com/TAM/dyn/air/redemption/availability;jsessionid=IOEqg0cEtdolNg6cA8SbHSb7Rq6QoxgX4272JUK9w7gpJlRHVCj_!-215252347!-94134157?B_DATE_1=201608020000&B_DATE_2=201608110000&B_LOCATION_1=CNF&LANGUAGE=BR&passenger_useMyPoints=true&WDS_MARKET=BR&children=0&E_LOCATION_1=BSB&SERVICE_ID=2&SITE=JJRDJJRD&COUNTRY_SITE=BR&WDS_AWARD_CORPORATE_CODE=&MARKETING_CABIN=E&adults=1&infants=0&TRIP_TYPE=R'
request(BASE_URL, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    const voos = []
    var $ = cheerio.load(html)
    $('[class*=" flightType"]').each(function(i, element){
      const voo = {}
      voo.de = $(this).children('.fromTh').text()
      voo.para = $(this).children('.toTh').text()
      voo.voo = $(this).children('.flightNumber .linkFlif').text()
      voo.duracao = $(this).children('.durationTh').text()
      voo.promo = $(this).children('.ff-EPROMOD').text();
      voo.classico = $(this).children('.ff-ECLASSICOD').text()
      voo.irrestrito = $(this).children('.ff-EIRRESTRID').text()
      console.log('voo', voo)
      // console.log('para', voo.para)
      // console.log('voo', voo.voo)
      // console.log('duracao', voo.duracao)
      // console.log('promo', voo.promo)
      // console.log('classico', voo.classico)
      // console.log('irrestrito', voo.irrestrito)
      voos.push(voo)
      // if(i>1) return false;
    })
    console.log('voos', voos)
    fs.writeFile('voos.json', voos, (err) => {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  }
});