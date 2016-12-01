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
function getTheHighestRatedBeers(){
     console.log('in get the highest rated beers in api');
            let  myUrl = `${baseURL}user/beers/gregavola?sort=highest_rated&client_id=${clientId}&client_secret=${clientSecret}`;
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
 
 function getTheLowestRatedBeers(){
     console.log('in get the highest rated beers in api');
            let  myUrl = `${baseURL}user/beers/gregavola?sort=lowest_rated&client_id=${clientId}&client_secret=${clientSecret}`;
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
    
function getMyHighestRatedBeers(){
     console.log('in get my highest rated beers in api');
            let  myUrl = `${baseURL}user/beers/gregavola?sort=highest_rated_you&client_id=${clientId}&client_secret=${clientSecret}`;
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
 
 function getMyLowestRatedBeers(){
     console.log('in get my highest rated beers in api');
            let  myUrl = `${baseURL}user/beers/gregavola?sort=lowest_rated_you&client_id=${clientId}&client_secret=${clientSecret}`;
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
            //let  myUrl = `${baseURL}user/info/?access_token=73F269F6A22524CE3A635B1B316DE0566DD3C6BA`;
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
    
    function searchBreweryByName(breweryName){
        console.log('in search brewery by name in the API with brewery named ' + breweryName);
          let  myUrl = `${baseURL}search/beer?q=${breweryName}&client_id=${clientId}&client_secret=${clientSecret}`;
            let    options = {
                     method: 'GET',
                    uri: `${baseURL}search/brewery?q=${breweryName}&client_id=${clientId}&client_secret=${clientSecret}`,
                    transform: function (body, response) {
                        body = JSON.parse(body);
                        console.log(body);
                        return body;
                    }
                };
                
        return request(options);
    }

   
api = {
    getMyWishList : getMyWishList,
    getMyUserStats : getMyUserStats,
    searchBeerNames : searchBeerNames,
    getMyHighestRatedBeers : getMyHighestRatedBeers,
    getMyLowestRatedBeers : getMyLowestRatedBeers,
    getTheLowestRatedBeers : getTheLowestRatedBeers,
    getTheHighestRatedBeers : getTheHighestRatedBeers,
    searchBreweryByName : searchBreweryByName
}

module.exports = api;