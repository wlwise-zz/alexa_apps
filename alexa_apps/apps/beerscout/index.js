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

app.intent('searchBeerByName', {
    slots:{"name" : "name"}
}, function(request,response) {
    console.log(`in search beer by name in index.js with parameter ${request.slot('name')}`);
    response.shouldEndSession('false');
    beerscoutAPI.searchBeerNames(request.slot('name')).then(function (dataResponse) {
        console.log(dataResponse.response.beers.count);
         console.log(dataResponse.response.beers.items[0]);
        var beerCount = dataResponse.response.beers.count + 1;
        if (beerCount === 1){
            response.say(`Sorry, I couldn't find any beer named ${request.slot('name')}.`);
            response.send();
        }else if (beerCount === 2){
            response.say(`I found this about ${dataResponse.response.beers.items[0].beer.beer_name}.  It is a 
            ${dataResponse.response.beers.items[0].beer.beer_style} style beer.  It's alcohol by volume is
            ${dataResponse.response.beers.items[0].beer.beer_abv}.  It is made by
            ${dataResponse.response.beers.items[0].brewery.brewery_name}.  There have been 
            ${dataResponse.response.beers.items[0].checkin_count} checkins for this beer.`);
            var have_had = dataResponse.response.beers.items[0].have_had;
            console.log(have_had);
            if (have_had.toString() === "false") {
                response.say('You have not had this beer yet.  Why not try it now?');
            }else {
                response.say(`You have checked-in this beer 
                ${dataResponse.response.beers.items[0].your_count} times.`)
            }
            response.send();
        }else {
            var myArray = dataResponse.response.beers.items;
             for (var item of myArray) {
                console.log(item.beer.beer_name);
            }
        }
        
    }).catch(function (reason) {
        console.log('whoops from index.js ' + reason);
        response.say(`I could not find a beer by the name of ${request.slot('name')}`);
        response.send();
        
    });
    return false;
});

module.exports = app;
