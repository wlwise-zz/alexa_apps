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



function getMyWishList(){
     console.log('in get my wish list in api');
            let  myUrl = `${baseURL}user/wishlist/gregavola?client_id=${clientId}&client_secret=${clientSecret}`;
            let    options = {
                     method: 'GET',
                    uri: myUrl,
                    transform: function (body, response) {
                        body = JSON.parse(body);
                        console.log(body);
                        return body;
                    }
                };
                
        return request(options);
 }
 
 function getMyUserStats(){
     console.log('in get my user stats in api');
            let  myUrl = `${baseURL}user/info/gregavola?client_id=${clientId}&client_secret=${clientSecret}`;
            let    options = {
                     method: 'GET',
                    uri: myUrl,
                    transform: function (body, response) {
                        body = JSON.parse(body);
                        console.log(body);
                        return body;
                    }
                };
                
        return request(options);
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
    getMyWishList : getMyWishList,
    getMyUserStats : getMyUserStats,
    searchBeerNames : searchBeerNames
}

module.exports = api;