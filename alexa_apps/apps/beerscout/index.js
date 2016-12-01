var alexa = require('alexa-app');
var beerscoutAPI = require('./lib/untpd_beerscout_api');

var _ = require('lodash');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
var app = new alexa.app('beerscout');
app.launch(function(req,res) {
	
	//TODO:  update once OAUTH is fixed.
    //var accessToken = "73F269F6A22524CE3A635B1B316DE0566DD3C6BA";
//     var accessToken = req.sessionDetails.accessToken;
//     if (accessToken === null) {
//         res.linkAccount().shouldEndSession(true).say("Your UnTappd account is not linked. Please use the Alexa App to link the account.");
//         return true;
//     } else {
//         res.say("Welcome to Beer Scout.  You can say - my check-ins, my wish list, highest ranked beers, lowest ranked beers, search beer, or search breweries.  What would you like to do?");
//         res.session('inSession', 'true');
//         res.shouldEndSession('false');
//     }

        res.say("Welcome to Beer Scout.  You can say - my check-ins, my wish list, highest ranked beers, lowest ranked beers, search beer, or search breweries.  What would you like to do?");
        res.session('inSession', 'true');
        res.shouldEndSession('false');
});

app.intent('help', function (request, response){
    console.log('in help intent');
    response.shouldEndSession('false');
    response.say("Beer Scout lets you learn about beers and breweries.  You can say things like - highest rated beer, search beer, search brewery, or lowest rated beer. You can say - tell me about brewery Goose Island Beer' for instance.  What would you like to do?");
    response.send();
});

app.intent('getTheHighestRatedBeer', 
function (request, response){
    console.log('in the highest rated beer in index.js');
    response.shouldEndSession('false');
    //when OAUTH works
    //beerscoutAPI.getTheHighestRatedBeers(request.sessionDetails.account).then(function(dataResponse){
    beerscoutAPI.getTheHighestRatedBeers().then(function(dataResponse){    
        console.log(dataResponse.response.beers.items[0]);
        console.log('number of ratings ' + dataResponse.response.beers.items[0].rating_count);
        console.log(dataResponse.response.beers.items[0].beer.beer_label);
        makeCard(dataResponse.response.beers.items[0].beer.beer_label, "The highest rated beer", dataResponse.response.beers.items[0].beer.beer_name, response);
        response.say(`The highest rated beer is
            ${dataResponse.response.beers.items[0].beer.beer_name}, which is brewed by 
            ${dataResponse.response.beers.items[0].brewery.brewery_name}.  This beer is rated at
            ${dataResponse.response.beers.items[0].beer.rating_score} out of 5.  
            ${dataResponse.response.beers.items[0].beer.rating_count} people have rated this beer.`);
            response.send();
    })
    return false;
});

app.intent('getTheLowestRatedBeer', 
function (request, response){
    console.log('in the lowest rated beer in index.js');
    response.shouldEndSession('false');
    beerscoutAPI.getTheLowestRatedBeers().then(function(dataResponse){
        console.log(dataResponse.response.beers.items[0]);
        makeCard(dataResponse.response.beers.items[0].beer.beer_label, "The lowest rated beer", dataResponse.response.beers.items[0].beer.beer_name, response);
        
        response.say(`The lowest rated beer is
            ${dataResponse.response.beers.items[0].beer.beer_name}, which is brewed by 
            ${dataResponse.response.beers.items[0].brewery.brewery_name}.  This beer is rated at
            ${dataResponse.response.beers.items[0].beer.rating_score} out of 5.  
            ${dataResponse.response.beers.items[0].beer.rating_count} people have rated this beer.`);
            response.send();
    })
    return false;
});

app.intent('getMyHighestRatedBeer', 
function (request, response){
    console.log('in my highest rated beer in index.js');
    response.shouldEndSession('false');
    beerscoutAPI.getMyHighestRatedBeers().then(function(dataResponse){
        console.log(dataResponse.response.beers.items[0]);
        console.log('number of ratings ' + dataResponse.response.beers.items[0].rating_count);
        makeCard(dataResponse.response.beers.items[0].beer.beer_label, "My highest rated beer", dataResponse.response.beers.items[0].beer.beer_name, response);
        
        response.say(`Your highest rated beer is
            ${dataResponse.response.beers.items[0].beer.beer_name}, which is brewed by 
            ${dataResponse.response.beers.items[0].brewery.brewery_name}.  This beer is rated at
            ${dataResponse.response.beers.items[0].beer.rating_score} out of 5.  
            ${dataResponse.response.beers.items[0].beer.rating_count} people have rated this beer.`);
            response.send();
    })
    return false;
});

app.intent('getMyLowestRatedBeer', 
function (request, response){
    console.log('in my lowest rated beer in index.js');
    response.shouldEndSession('false');
    beerscoutAPI.getMyLowestRatedBeers().then(function(dataResponse){
        console.log(dataResponse.response.beers.items[0]);
        makeCard(dataResponse.response.beers.items[0].beer.beer_label, "My lowest rated beer", dataResponse.response.beers.items[0].beer.beer_name, response);
        
        response.say(`Your lowest rated beer is
            ${dataResponse.response.beers.items[0].beer.beer_name}, which is brewed by 
            ${dataResponse.response.beers.items[0].brewery.brewery_name}.  This beer is rated at
            ${dataResponse.response.beers.items[0].beer.rating_score} out of 5.  
            ${dataResponse.response.beers.items[0].beer.rating_count} people have rated this beer.`);
            response.send();
    })
    return false;
});

app.intent('getMyWishList', 
function (request, response){
    console.log('in my stats in index.js');
    response.shouldEndSession('false');
    beerscoutAPI.getMyWishList().then(function(dataResponse){
        if (dataResponse.response.count === 0){
            response.say("You don't have any brews on your wish list.  Are you feeling okay?");
        } else if (dataResponse.response.count === 1){
            response.say(`You have one lonely brew on your wish list.  Don't you think ${dataResponse.response.beers.items[0].beer.beer_name} deserves some friends?`);
        }else {
            if (dataResponse.response.count > 20) {
                response.say(`My what a big wish list you have.  You have ${dataResponse.response.count} items on your list.  Here are a few of them...`);
            }
            var myArray = dataResponse.response.beers.items;
            console.log('wish list size - ' + myArray.length);
            if (myArray.length > 5) {
                response.session('wishListCountReturned', 'myArray.length');
                myArray.length = 5;
            }
            makeCard(dataResponse.response.beers.items[0].beer.beer_label, "Top of my wish list", dataResponse.response.beers.items[0].beer.beer_name, response);
        
            for (var i = 0; i < myArray.length; i++){
                    response.say(`${dataResponse.response.beers.items[i].beer.beer_name}...`);
                }
        }
        console.log(dataResponse.response.count);
       response.send(); 
    })
    
    return false;
});

app.intent('getMyUserStats', 
function (request, response){
    console.log('in my stats in index.js');
    response.shouldEndSession('false');
    var totalBeers = 0;
    var avatar = "http://bit.ly/2fTin8R";
    beerscoutAPI.getMyUserStats().then(function(dataResponse){
        console.log('retrieved user data in index.js');
       
        
        response.say(`Hey ${dataResponse.response.user.first_name}.`);
        
        if (dataResponse.response.user.stats.total_checkins){
            response.say(`You have checked in ${dataResponse.response.user.stats.total_checkins} times, and `);
        }else {
            response.say("You haven't checked in anywhere.  Don't you get out?");
        }
        
        if (dataResponse.response.user.stats.total_beers){
            response.say(`you've tried a total of ${dataResponse.response.user.stats.total_beers} beers.`);
            totalBeers = dataResponse.response.user.stats.total_beers;
        } else {
            
            response.say("You haven't tried any beers yet.  Get on that!");
        }
        
        if (dataResponse.response.user.stats.total_friends){
           response.say(`You have ${dataResponse.response.user.stats.total_friends} friends and`);  
        }else {
            response.say("It must be lonely being you - you don't have any friends");
        }
        
        if (dataResponse.response.user.stats.total_followings){
            response.say(`you have ${dataResponse.response.user.stats.total_followings} followings.`);
        }else {
            response.say ("wow.  You don't have any followings.  I'm so sorry.");
        }
        
        console.log(dataResponse.response.user.recent_brews.items[0].beer.beer_name);
        
        if (dataResponse.response.user.recent_brews.count === 0){
            response.say(`You haven't had any brews lately.  Hop to it.`);
        } else if (dataResponse.response.user.recent_brews.count === 1){
            response.say(`You have only had 1 brew lately. It was
             ${dataResponse.response.user.recent_brews.items[0].beer.beer_name}.  Are you feeling okay?`);
        } else {
            response.say(`You have  had ${dataResponse.response.user.recent_brews.count} brews lately. The most recent one was
             ${dataResponse.response.user.recent_brews.items[0].beer.beer_name}. Good work`);
        }
        if (dataResponse.response.user.user_avatar){
            avatar = dataResponse.response.user.user_avatar;
        }
        makeCard(dataResponse.response.user.user_avatar, "My user stats", totalBeers, response);
         response.send();
    })
    
   
    return false;
});

app.intent('searchBeerByName', {
    slots:{"NAME" : "NAME"}
}, function(request,response) {
    console.log(`in search beer by name in index.js with parameter ${request.slot('NAME')}`);
    response.shouldEndSession('false');
    if (request.slot('NAME')){
        
    }else {
        response.say("Okay - search for beer.  What beer would you like to search on?");
        response.send();
    }
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
              
              makeCard(dataResponse.response.beers.items[0].beer.beer_label, "Beer Search", dataResponse.response.beers.items[0].beer.beer_name, response);
            var have_had = dataResponse.response.beers.items[0].have_had;
            console.log(have_had);
            if (have_had.toString() === "false") {
                response.say(`You have not had this beer yet, but 
                 ${dataResponse.response.beers.items[0].checkin_count} people have.
                Why not try it now?`);
            }else {
                response.say(`You and ${dataResponse.response.beers.items[0].checkin_count} people have checked-in this beer.  You have
                    checked in on this beer
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
        response.say(`Sorry.  I had some sort of issue.  Maybe it was too much beer.  Please try your request again.`);
        response.send();
        
    });
    return false;
});

app.intent('searchBreweryByName', {
    slots:{"BREWERYNAME" : "BREWERYNAME"}
}, function(request,response) {
    console.log(`in search brewery by name in index.js with parameter ${request.slot('BREWERYNAME')}`);
    if (request.slot("BREWERYNAME")){
        //change this later.
    }else {
        response.say("Okay - search for brewery.  What brewery would you like to search for?");
        response.send();
    }
    response.shouldEndSession('false', "I'm sorry I didn't get that.  I may have had too many beers.  Can you repeat it?");
    beerscoutAPI.searchBreweryByName(request.slot('BREWERYNAME')).then(function (dataResponse) {
        console.log(dataResponse.response.brewery.count);
         console.log(dataResponse.response.brewery.items[0]);
        var breweryCount = (dataResponse.response.brewery.count + 1);
        if (breweryCount === 1){
            response.say(`Sorry, I couldn't find any breweries named ${request.slot('BREWERYNAME')}.`);
            response.send();
        }else if (breweryCount === 2){
            response.say(`I found this about ${dataResponse.response.brewery.items[0].brewery.brewery_name}.  This brewery produces 
                 ${dataResponse.response.brewery.items[0].brewery.beer_count} beers.`);
            if (dataResponse.response.brewery.items[0].brewery.country_name.length > 5) {
                response.say(`Its country of origin is
                    ${dataResponse.response.brewery.items[0].brewery.country_name}.`);
            }
            if (dataResponse.response.brewery.items[0].brewery.location.brewery_city.length > 1) {
                response.say(`It's located in 
                    ${dataResponse.response.brewery.items[0].brewery.location.brewery_city}.`);
            }
            if (dataResponse.response.brewery.items[0].brewery.location.brewery_state.length > 1){
                response.say(`In ${dataResponse.response.brewery.items[0].brewery.location.brewery_state}.`);
            }
            makeCard(dataResponse.response.brewery.items[0].brewery.brewery_label, "Brewery Search", dataResponse.response.brewery.items[0].brewery.brewery_name, response);
            response.send();
        }else { //more than one brewery returned

            var myArray = dataResponse.response.brewery.items;
            console.log('more than one brewery returned - ' + myArray.length);
            response.say(`I found several breweries related to ${request.slot('BREWERYNAME')}.  Did you mean one of these?`);
            if (myArray.length > 5) {
                response.session('breweryCountReturned', 'myArray.length');
                myArray.length = 5;
            }
                for (var i = 0; i < myArray.length; i++){
                    response.say(`${dataResponse.response.brewery.items[i].brewery.brewery_name}...`);
                }
            response.send();
             for (var item of myArray) {
                console.log(item.brewery.brewery_name);
            }
        }
        
    }).catch(function (reason) {
        console.log('whoops from index.js ' + reason);
        response.say(`Sorry.  I had some sort of issue.  Maybe it was too much beer.  Please try your request again.`);
        response.send();
        
    });
    return false;
});


//***************Card Functionality
function makeCard(thumbnail, title, name, response) {
        console.log(thumbnail + " " + title + " " + name);
    try{
        // what shows up on the home card
        response.card({
            "type": "Standard",
            "title": title,
            "text": name,
            "image": {
                "smallImageUrl": thumbnail,
                "largeImageUrl": thumbnail
            }
        });
    } catch (err) {
        console.log(err);
    }
    }




module.exports = app;
