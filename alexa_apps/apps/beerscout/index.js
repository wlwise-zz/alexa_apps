var alexa = require('alexa-app');
var beerscoutAPI = require('./lib/untpd_beerscout_api');

var _ = require('lodash');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
var app = new alexa.app('beerscout');
app.launch(function(req,res) {
	res.say("Welcome to Beer Scout.  You can say - today's beer, search beer, or search brewery");

    res.session('inSession', 'true');
    res.shouldEndSession('false');
});

app.intent('ListBeerTypeIntent', function(req,response) {
            console.log('here in intent');
            response.shouldEndSession('false');
            beerscoutAPI.getBeerTypes().then(function (beerStyle) {

                response.say(`here are 5 beer types, 
                ${beerStyle.data[0].name},
                ${beerStyle.data[1].name},
                ${beerStyle.data[2].name},
                ${beerStyle.data[3].name},
                ${beerStyle.data[4].name},
                Would you like to hear the description of one of these?`);
                response.session('nextBeerType', 4);
                response.send();
            }).catch(function (reason) {
                console.log('whoops ' + reason);
            });
            return false;
    });

app.intent('listBeerStyleDescription', {
    slots:{"style" : "style"}
}, function(request,response) {
    console.log(`in get style description ${request.slot('style')}`);
    response.shouldEndSession('false');
    beerscoutAPI.getBeerType(request.slot('style')).then(function (beerStyle) {
        response.say(`here is more information about
                ${beerStyle.name}   -
                ${beerStyle.description}.
                The alcohol by volume for this beer style
                is minimum ${beerStyle.abvMin}  and maximum ${beerStyle.abvMax}
                Would you like to hear the names of some beer in this style?`);
        response.send();
    }).catch(function (reason) {
        console.log('whoops ' + reason);
    });
    return false;
});

app.intent('searchBeerByName', {
    slots:{"name" : "name"}
}, function(request,response) {
    console.log(`in get style description ${request.slot('name')}`);
    response.shouldEndSession('false');
    beerscoutAPI.getBeerByName(request.slot('name')).then(function (beerStyle) {
        if (beerStyle.data[0].name){
            response.say(`here is more information about
                ${beerStyle.data[0].name}   -
                ${beerStyle.data[0].description}.
                The alcohol by volume for this beer 
                is ${beerStyle.data[0].abv} `);
            response.send();
        }else {
            response.say(`I could not find a beer by the name of ${request.slot('name')}`);
            response.send();
        }

    }).catch(function (reason) {
        beerscoutAPI.searchBeerNames(request.slot('name')).then(function (searchResults){
           response.say(`I couldn't find ${request.slot('name')}, did you mean ${searchResults.data[0].name} ?`);
            response.send();
        });
        response.say(`I could not find a beer by the name of ${request.slot('name')}`);
        response.send();
        console.log('whoops ' + reason);
    });
    return false;
});

module.exports = app;
