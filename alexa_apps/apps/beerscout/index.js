var alexa = require('alexa-app');
var beerscoutAPI = require('./lib/untpd_beerscout_api');

var _ = require('lodash');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
var app = new alexa.app('beerscout');
app.launch(function(req,res) {
	res.say("Welcome to Beer Scout.  You can say - my check-ins, my wish list, search beer, or search brewery");

    res.session('inSession', 'true');
    res.shouldEndSession('false');
});

app.intent('getMyUserStats', 
function (request, response){
    console.log('in my stats in index.js');
    response.shouldEndSession('false');
    beerscoutAPI.getMyUserStats().then(function(dataResponse){
        console.log('retrieved user data in index.js');
        response.say(`Hey ${dataResponse.response.user.first_name}. You have checked in 
        ${dataResponse.response.user.stats.total_checkins} times, tried 
        ${dataResponse.response.user.stats.total_beers} beers, and have
        ${dataResponse.response.user.stats.total_friends} friends. `);
        
        console.log(dataResponse.response.user.recent_brews.items[0].beer.beer_name);
        
        if (dataResponse.response.user.recent_brews.count === 0){
            response.say(`You haven't had any brews lately.  Hop to it.`);
        } else if (dataResponse.response.user.recent_brews.count === 1){
            response.say(`You have only had 1 brew lately. It was
             ${dataResponse.response.user.recent_brews.items[0].beer.beer_name}.  Are you feeling okay?`);
        } else {
            response.say(`You have  had ${dataResponse.response.user.recent_brews.count} brews lately. The most recent one was
             ${dataResponse.response.user.recent_brews.items[0].beer.beer_name}.`);
        }
         response.send();
    })
    
   
    return false;
});

app.intent('searchBeerByName', {
    slots:{"NAME" : "NAME"}
}, function(request,response) {
    console.log(`in search beer by name in index.js with parameter ${request.slot('NAME')}`);
    response.shouldEndSession('false');
    beerscoutAPI.searchBeerNames(request.slot('NAME')).then(function (dataResponse) {
        console.log(dataResponse.response.beers.count);
         console.log(dataResponse.response.beers.items[0]);
        var beerCount = dataResponse.response.beers.count + 1;
        if (beerCount === 1){
            response.say(`Sorry, I couldn't find any beer named ${request.slot('NAME')}.`);
            response.send();
        }else if (beerCount === 2){
            response.say(`I found this about ${dataResponse.response.beers.items[0].beer.beer_name}.  It is a 
                ${dataResponse.response.beers.items[0].beer.beer_style} style beer.`);
            if (dataResponse.response.beers.items[0].beer.beer_description.length > 5) {
                response.say(`It is described as
                    ${dataResponse.response.beers.items[0].beer.beer_description}.`);
            }
            if (dataResponse.response.beers.items[0].beer.beer_abv.length > 1) {
                response.say(`It's alcohol by volume is
                    ${dataResponse.response.beers.items[0].beer.beer_abv}.`);
            }
            if (dataResponse.response.beers.items[0].brewery.brewery_name.length > 3 ){
                response.say(`It is made by ${dataResponse.response.beers.items[0].brewery.brewery_name}.`);
            }
            if (dataResponse.response.beers.items[0].checkin_count.length > 0){
                response.say(`There have been 
                    ${dataResponse.response.beers.items[0].checkin_count} checkins for this beer.`);
            }  
              
              
            var have_had = dataResponse.response.beers.items[0].have_had;
            console.log(have_had);
            if (have_had.toString() === "false") {
                response.say('You have not had this beer yet.  Why not try it now?');
            }else {
                response.say(`You have checked-in this beer 
                    ${dataResponse.response.beers.items[0].your_count} times.`)
            }
            response.send();
        }else { //more than one beer returned

            var myArray = dataResponse.response.beers.items;
            console.log('more than one beer returned - ' + myArray.length);
            response.say(`I found several beers related to ${request.slot('NAME')}.  Did you mean one of these?`);
            if (myArray.length > 5) {
                response.session('beerCountReturned', 'myArray.length');
                myArray.length = 5;
            }
                for (var i = 0; i < myArray.length; i++){
                    response.say(`${dataResponse.response.beers.items[i].beer.beer_name}...`);
                }
            response.send();
             for (var item of myArray) {
                console.log(item.beer.beer_name);
            }
        }
        
    }).catch(function (reason) {
        console.log('whoops from index.js ' + reason);
        response.say(`I could not find a beer by the name of ${request.slot('NAME')}`);
        response.send();
        
    });
    return false;
});

module.exports = app;
