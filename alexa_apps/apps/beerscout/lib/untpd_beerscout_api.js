/**
 * Created by wendywise on 11/27/16.
 */
'use strict';
let config = require('../config/config'),
    api,
    request = require('request-promise'),
    _ = require('lodash'),
     UntappdClient = require("node-untappd"),
    baseURL = config.get('untappdAPI').v4.url,
    clientId = config.get('untappdAPI').clientId.cid,
    clientSecret = config.get('untappdAPI').clientSecret.cs;


function getBeerTypes() {
    console.log('in get beer types');
 
}

function getBeerByName(beerName){
    console.log('in get  beer by name in the API with beer named ' + beerName);
//     let  myNewUrl = `${baseURL}search/beer?q=${beerName}&client_id=${clientId}&client_secret=${clientSecret}`;
//          console.log(myNewUrl)
//           let  myUrl = `${baseURL}search/beer?q=${beerName}&client_id=${clientId}&client_secret=${clientSecret}`,
//                 options = {
//                      method: 'GET',
//                     uri: myUrl,
//                     transform: function (body, response) {
//                         body = JSON.parse (body);
//                         return body;
//                     }
//                 };
//         return request(options);
 }

    function searchBeerNames(beerName){
        console.log('in search beer by name in the API with beer named ' + beerName);
          let  myUrl = `${baseURL}search/beer?q=${beerName}&client_id=${clientId}&client_secret=${clientSecret}`;
            let    options = {
                     method: 'GET',
                    uri: `${baseURL}search/beer?q=${beerName}&client_id=${clientId}&client_secret=${clientSecret}`,
                    transform: function (body, response) {
                        body = JSON.parse(body);
                        console.log(body);
                        return body;
                    }
                };
                
        return request(options);
    }

    function getBeerType(style) {
        console.log('in get beer type with ' + style);

}
// function getBeerByName(beerName) {
//     let transformedId = encodeURIComponent(segmentId);
//     let options = {
//         url: `${baseURL}v1/segment/${transformedId}/tagged`,
//         transform: function (body, response) {
//             body = JSON.parse(body);
//             return addAudioURLtoPayload(body);
//         }
//     };
//     return request(options);
// }

api = {
    getBeerTypes: getBeerTypes,
    getBeerType: getBeerType,
    getBeerByName: getBeerByName,
    searchBeerNames : searchBeerNames
}

module.exports = api;