/**
 * Created by wendywise on 11/27/16.
 */
'use strict';
let config = require('../config/config'),
    api,
    request = require('request-promise'),
    _ = require('lodash'),
    UnTappd = require('node-untappd'),
    baseURL = config.get('untappdAPI').v4.url;

var debug = true;
var client = new UnTappd(debug);
var clientId = "C3B03418C87E85940E025B3B497A5E77365C2FED"; // Replace this with your CLIENT ID
var clientSecret = "071BB606D27FFA3E4669A4F94631586A14FE79F4"; // Replace this with your CLIENT SECRET

client.setClientId(clientId);
client.setClientSecret(clientSecret);

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
    var lookupuser = "aria";
    untappd.userFeed(function(err,obj){
        var beers = obj.results.forEach(function(checkin){
            console.log("\n"+username,"drank",checkin.beer_name);
            console.log("by",checkin.brewery_name);
            if (checkin.venue_name) console.log("at",checkin.venue_name);
            console.log("on",checkin.created_at);
        });
    },lookupuser);
    // return client.beerSearch(function(err, data){
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log(data);
    // },"pliny");
}

    function searchBeerNames(beerName){
        console.log('in search beer by name with beer named ' + beerName);
        let options = {
            url: `${baseURL}v1/segment/${transformedId}/tagged`,
            transform: function (body, response) {
                body = JSON.parse(body);
                return addAudioURLtoPayload(body);
            }
        };
        return request(options);
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