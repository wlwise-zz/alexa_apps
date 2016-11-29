/**
 * Created by wendywise on 11/27/16.
 */
'use strict';
let config = require('../config/config'),
    api,
    request = require('request-promise'),
    _ = require('lodash'),
    BreweryDb = require('node-brewerydb'),
    baseURL = config.get('beerscoutAPI').v1.url;


var client = new BreweryDb({apiKey: "88777f673e1440188c838c50ceab37ab"});

function getBeerTypes() {
    console.log('in get beer types');
    return client.styles().then(function (res) {

        console.log("returning styles " + res.data[0].name);
        return res;
    }, function (err) {
        console.log("whoops" + err);
    });
}

function getBeerByName(beerName){
    console.log('in get  beer by name with beer named ' + beerName);

    return client.beers({name: beerName}, function(err, res) {
        if (err) {
            console.log(err);
        }
        console.log(res);
        var beerNameBack = _.find(res.data, {'name': beerName});
        var success = "yes";
        if (beerNameBack){
            return res;
        }else {
            success = "no";
            return success;
        }
    });
}

    function searchBeerNames(beerName){
        console.log('in search beer by name with beer named ' + beerName);
        return client.search.all({q: beerName}, function(err, res) {
            if (err) {
                console.log(err);
            }
            console.log(res);
            return res;
        });
    }

    function getBeerType(style) {
        console.log('in get beer type with ' + style);
        return client.styles().then(function (res) {
            var beerStyle = _.find(res.data, {'name' : style});
            console.log("returning styles " + beerStyle.name);
            return beerStyle;
        }, function (err) {
            console.log("whoops" + err);
        });
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