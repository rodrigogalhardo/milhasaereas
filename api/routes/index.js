const express = require('express')
const router = express.Router()
const request = require('request')
const cheerio = require('cheerio')
const circularJSON = require('circular-json');
const fs = require('fs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const _schema = {
  sentido: String,
  de: String,
  para: String,
  voo: String,
  duracao: String,
  promo: String,
  classico: String,
  irrestrito: String,
}

const vooSchema = new Schema(_schema)

const VooModel = mongoose.model('Voo', vooSchema)

const BASE_URL = 'http://book.latam.com/TAM/dyn/air/redemption/availability;'
let jsessionid = 'IOEqg0cEtdolNg6cA8SbHSb7Rq6QoxgX4272JUK9w7gpJlRHVCj_!-215252347!-94134157'
let B_DATE_1 = '201608050000'
let B_DATE_2 = '201608110000'
let B_LOCATION_1 = 'GRU'
let LANGUAGE = 'BR'
let passenger_useMyPoints = true
let WDS_MARKET = 'BR'
let children = 0
let E_LOCATION_1 = 'JFK'
let SERVICE_ID = 2
let SITE = 'JJRDJJRD'
let COUNTRY_SITE = 'BR'
let WDS_AWARD_CORPORATE_CODE = ''
let MARKETING_CABIN = 'E'
let adults = 1
let infants = 0
let TRIP_TYPE = 'R'

let URL_FULL = `${BASE_URL}jsessionid='${jsessionid}&
                  B_DATE_2=${B_DATE_2}&
                  B_LOCATION_1=${B_LOCATION_1}&
                  LANGUAGE=${LANGUAGE}&
                  passenger_useMyPoints=${passenger_useMyPoints}&
                  WDS_MARKET=${WDS_MARKET}&
                  children=${children}&
                  E_LOCATION_1=${E_LOCATION_1}&
                  SERVICE_ID=${SERVICE_ID}&
                  SITE=${SITE}&
                  COUNTRY_SITE=${COUNTRY_SITE}&
                  WDS_AWARD_CORPORATE_CODE=${WDS_AWARD_CORPORATE_CODE}&
                  MARKETING_CABIN=${MARKETING_CABIN}&
                  adults=${adults}&
                  infants=${infants}&
                  TRIP_TYPE=${TRIP_TYPE}
                  `.replace(/\s/g, '')

console.log('URL_FULL', URL_FULL)

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' })
})

router.get('/pegaVoos/listar', function (req, res) {
  VooModel.find({}, (err, data) => {
    if (err) throw new Error(err)
    res.render('voos-lista', { voos: data })
  })
})

router.get('/pegaVoos/buscar', function (req, res) {
  const Criancas = req.body.Criancas || 0
  const Adultos = req.body.Adultos || 1
  const TipoViagem = req.body.TipoViagem || 1
  const Trechos = req.body.Trechos || [
    {
      'DataIda': '13/04/2016',
      'Destino': 'GRU',
      'DataVolta': '28/04/2016',
      'Origem': 'GIG'
    }
  ]
  const Chave = req.body.Chave || 0
  const Senha = req.body.Senha || 0
  const TipoBusca = req.body.TipoBusca || 1
  const Bebes = req.body.Bebes || 0
  const Companhias = req.body.Companhias || [ 'tam' ]
  const busca = {
    'Status': {
      'Alerta': [],
      'Erro': false,
      'Sucesso': true
    },
    'Busca': {
      'Criancas': Criancas,
      'Adultos': Adultos,
      'TipoViagem': TipoViagem,
      'Trechos': Trechos,
      'Chave': Chave,
      'Senha': Senha,
      'TipoBusca': TipoBusca,
      'Bebes': Bebes,
      'Companhias': Companhias
    }
  }
  console.log('busca', busca)
// VooModel.find({}, (err, data) => {
//   if(err) throw new Error(err)
//   res.render('voos-lista', { voos: data })
// })
})

router.post('/pegaVoos/', function (req, res) {
  // http://book.latam.com/TAM/dyn/air/redemption/availability;jsessionid=V3UvCP25QH7KFS3nNDAvpF0wbGWSuAwfvsJC19ajFbek4IGv9G9C!-957067975!1955180264?
  // B_DATE_1=201607290000&
  // B_DATE_2=201608020000&
  // B_LOCATION_1=CNF&
  // LANGUAGE=BR&
  // WDS_MARKET=BR&
  // passenger_useMyPoints=true&
  // children=0&
  // E_LOCATION_1=BSB&
  // SERVICE_ID=2&
  // SITE=JJRDJJRD&
  // COUNTRY_SITE=BR&
  // WDS_AWARD_CORPORATE_CODE=&
  // adults=1&
  // infants=0&
  // TRIP_TYPE=R

  // console.log('req.body', req.body)
  const BASE_URL = 'http://book.latam.com/TAM/dyn/air/redemption/availability;jsessionid=V3UvCP25QH7KFS3nNDAvpF0wbGWSuAwfvsJC19ajFbek4IGv9G9C!-957067975!1955180264?'
  let jsessionid = 'IOEqg0cEtdolNg6cA8SbHSb7Rq6QoxgX4272JUK9w7gpJlRHVCj_!-215252347!-94134157'
  let B_DATE_1 = req.body.B_DATE_1 || '201608100000'
  let B_DATE_2 = req.body.B_DATE_2 || '201608220000'
  let B_LOCATION_1 = req.body.B_LOCATION_1 || 'GRU'
  let LANGUAGE = req.body.LANGUAGE || 'BR'
  let passenger_useMyPoints = req.body.passenger_useMyPoints || true
  let WDS_MARKET = req.body.WDS_MARKET || 'BR'
  let children = req.body.children || 0
  let E_LOCATION_1 = req.body.E_LOCATION_1 || 'JFK'
  let SERVICE_ID = req.body.SERVICE_ID || 2
  let SITE = req.body.SITE || 'JJRDJJRD'
  let COUNTRY_SITE = req.body.COUNTRY_SITE || 'BR'
  let WDS_AWARD_CORPORATE_CODE = req.body.WDS_AWARD_CORPORATE_CODE || ''
  let MARKETING_CABIN = req.body.MARKETING_CABIN || 'E'
  let adults = req.body.adults || 1
  let infants = req.body.infants || 0
  let TRIP_TYPE = req.body.TRIP_TYPE || 'R'

  let URL_FULL = `${BASE_URL}&
                    B_DATE_1=${B_DATE_1}&
                    B_DATE_2=${B_DATE_2}&
                    B_LOCATION_1=${B_LOCATION_1}&
                    LANGUAGE=${LANGUAGE}&
                    passenger_useMyPoints=${passenger_useMyPoints}&
                    WDS_MARKET=${WDS_MARKET}&
                    children=${children}&
                    E_LOCATION_1=${E_LOCATION_1}&
                    SERVICE_ID=${SERVICE_ID}&
                    SITE=${SITE}&
                    COUNTRY_SITE=${COUNTRY_SITE}&
                    WDS_AWARD_CORPORATE_CODE=${WDS_AWARD_CORPORATE_CODE}&
                    MARKETING_CABIN=${MARKETING_CABIN}&
                    adults=${adults}&
                    infants=${infants}&
                    TRIP_TYPE=${TRIP_TYPE}
                    `.replace(/\s/g, '')

  const voosida = []
  const voosvolta = []

  console.log('------------------------------------------')
  console.log('URL_FULL', URL_FULL)
  console.log('------------------------------------------')
  console.log('Começando a busca no site')
  console.log('------------------------------------------')
  request(URL_FULL, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      const voos = []
      let counter = 0
      var $ = cheerio.load(html)
      $('[class*="outbound "]').each(function (h, elementtable) {
        console.log('---------------- iterando voos de ida --------------')
        var $tableflights = $(elementtable).find('[class*=" flightType"]')
        getflights($tableflights, 'ida')

      // if(counter > 1) return true
      })

      $('[class*="inbound "]').each(function (j, elementtable) {
        console.log('---------------- iterando voos de volta --------------')
        var $tableflights = $(elementtable).find('[class*=" flightType"]')
        getflights($tableflights, 'volta')
      })

      function getflights (tableInBoundOutBound, typev) {
        tableInBoundOutBound.each(function (i, element) {
           const voo = {}
          voo.sentido = typev // voo de partida outbound_list_flight
          voo.de = $(this).children('.fromTh').text().trim()
          voo.para = $(this).children('.toTh').text().trim()
          voo.voo = $(this).children('.flightNumber').children('a').text()
          voo.duracao = $(this).children('.durationTh').text().trim()
          voo.promo = $(this).children('.ff-EPROMOD').text().trim()
          voo.classico = $(this).children('.ff-ECLASSICOD').text().trim()
          voo.irrestrito = $(this).children('.ff-EIRRESTRID').text().trim()
          // console.log('voo.voo', voo.voo)

          // voos.push(voo)

          // guarda no array principal
          if (typev === 'ida'){
            voosida.push(voos)
          }else if (typev === 'volta'){
            voosvolta.push(voos)
          }

          counter = i
          VooModel.create(voo, (err, data) => {
            if (err) throw new Error(err)
            console.log('Cadastrado: ', data)
          })
        })
      }

      
      voos.push({"voosida":voosida});
      voos.push({"voosvolta":voosvolta});
      var objvoos = circularJSON.stringify(voos);
      res.json(voos);
      //res.render('voos',  JSON.stringify(voos, function (key, value) {
      //  if (typeof value === 'object' && value !== null) {
      //    if (cache.indexOf(value) !== -1) {
      //      // Circular reference found, discard key
      //      return
      //    }
      //    // Store value in our collection
      //    cache.push(value)
      //  }
     //   return value
     // }));
     // cache = []; // funciona garbage collection
      // fs.writeFile('voos.json', JSON.stringify(voos), (err) => {
      //   if (err) throw err
      //console.log('salvos ' + counter + ' voos!')
    // })
    }
  })
})

module.exports = router
