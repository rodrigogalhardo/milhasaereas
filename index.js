const request = require('request');
const cheerio = require('cheerio');

const BASE_URL = 'http://book.latam.com/TAM/dyn/air/redemption/availability;jsessionid=IOEqg0cEtdolNg6cA8SbHSb7Rq6QoxgX4272JUK9w7gpJlRHVCj_!-215252347!-94134157?B_DATE_1=201608020000&B_DATE_2=201608110000&B_LOCATION_1=CNF&LANGUAGE=BR&passenger_useMyPoints=true&WDS_MARKET=BR&children=0&E_LOCATION_1=BSB&SERVICE_ID=2&SITE=JJRDJJRD&COUNTRY_SITE=BR&WDS_AWARD_CORPORATE_CODE=&MARKETING_CABIN=E&adults=1&infants=0&TRIP_TYPE=R'
request(BASE_URL, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $('.flightType-Direct').each(function(i, element){
      var de = $(this).children('.fromTh').text();
      var para = $(this).children('.toTh').text();
      var voo = $(this).children('.flightNumber .linkFlif').text();
      var duracao = $(this).children('.durationTh').text();
      var promo = $(this).children('.ff-EPROMOD').text();
      var classico = $(this).children('.ff-ECLASSICOD').text();
      var irrestrito = $(this).children('.ff-EIRRESTRID').text();
      console.log('de', de)
      console.log('para', para)
      console.log('voo', voo)
      console.log('duracao', duracao)
      console.log('promo', promo)
      console.log('classico', classico)
      console.log('irrestrito', irrestrito)
      if(i>1) return false;
    })
  }
});