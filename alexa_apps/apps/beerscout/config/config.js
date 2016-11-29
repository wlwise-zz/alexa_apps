/**
 * Created by wendywise on 11/27/16.
 */
'use strict';

var nconf = require('nconf'),
    environment,
    port,
    config;



config = {
    'default': {
        appName: 'BeerScout Skill'
    },
    dev: {
        beerscoutAPI: {
            v1: {
                'url' :'http://api.brewerydb.com/v2/'
            }
        },
        untappdAPI: {
            v4: {
                'url' :'http://untappd.com/api/v4'
            }
        }
    },
    prod: {
        beerscoutAPI: {
            v1: {
                'url' :'http://api.brewerydb.com/v2/'
            }
        }
    }
};
// process environment variables and command line arguments
nconf.env().argv();
// make sure we have an environment set or die
environment = nconf.get('ENVIRONMENT');
port = nconf.get('PORT');

if (typeof environment === 'undefined' || typeof port === 'undefined') {
    console.error(`ENVIRONMENT and/or PORT are not set. Shutting down.  ENVIRONMENT: ${environment} - PORT: ${port}`);
    process.exit(1);
}


// load the correct config based on environment
switch (environment.toLowerCase()) {
    case 'dev':
        nconf.defaults(config.dev);
        console.log('Using Dev Config');
        break;
    case 'prod':
        nconf.defaults(config.prod);
        console.log('Using Prod Config');
        break;
    default:
        console.log('using default');
        nconf.defaults(config.default);
}
/*
 * Load overrides that don't actually override anything, they just fill in the
 * blanks.
 */
nconf.overrides(config.default);


module.exports = nconf;
