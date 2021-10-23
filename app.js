let _ = require('lodash');
let moment = require('moment');
let config = require('./config');
let axios = config.axios;

setInterval(() => {
    // slug config to be checked
    let sluglist = [ "thecryptomoms", "topdogbeachclub", "cryptocannabisclub", "punkscapes" ];
    for(const slug of sluglist) {
        // calculating unix timestamp to search Events since the given Timestamp
        let searchBack = config.globals.search_back_min;
        let occurred_after = moment().startOf('minute').subtract(searchBack, "minutes").unix();

        // get all Listings Events from Opensea
        axios.get('https://api.opensea.io/api/v1/events', {
            params: {
                collection_slug: slug,
                event_type: 'created',
                occurred_after: occurred_after,
                only_opensea: 'true'
            }
        }).then((response) => {
            let events = _.get(response, ['data', 'asset_events']);
            console.log(`${slug}: ${events.length} Listings in the last ${searchBack} seconds.`);

            // parsing Listings Events
            _.each(events, (event) => {
                // extract data from opensea Event
                let asset_token_id = _.get(event, ['asset', 'token_id']);
                let event_id = _.get(event, ['id']);
                let totalPrice = _.get(event, 'starting_price');
                let collection_slug = _.get(event, ['collection_slug']);
                let tokenName = _.get(event, ['asset', 'name']);
                let image = _.get(event, ['asset', 'image_url']);
                let openseaLink = _.get(event, ['asset', 'permalink']);
                let seller = _.get(event, ['seller', 'user', 'username']) || _.get(event, ['seller', 'address']);
                let usdValue = _.get(event, ['payment_token', 'usd_price']);
                let tokenSymbol = _.get(event, ['payment_token', 'symbol']);

                // check if necessary fields are defined
                if (event_id === undefined || asset_token_id === undefined ){
                    return "UndefinedEvent";
                }
                if (slug != collection_slug){
                    return "EventSlugInvalid";
                }
                // generate tokenName if not defined in Event
                if (tokenName == null) tokenName = `${collection_slug}_${asset_token_id}`;

                // logging Event Details
                console.log(`INFO ${slug}: New Sales Event found. ID: ${asset_token_id}, Token: ${tokenName}, ImageUrl: ${image}, OS: ${openseaLink}, Seller: ${seller}, Price: ${totalPrice}`);

                // here comes your code
            });
        }).catch((error) => {
            console.error(error);
        });

        // get all Sales Events from Opensea
        axios.get('https://api.opensea.io/api/v1/events', {
            params: {
                collection_slug: slug,
                event_type: 'successful',
                occurred_after: occurred_after,
                only_opensea: 'true'
            }
        }).then((response) => {
            let events = _.get(response, ['data', 'asset_events']);
            console.log(`${slug}: ${events.length} Sales in the last ${searchBack} seconds.`);

            // parsing Sales Events
            _.each(events, (event) => {
                // extract data from opensea Event
                let asset_token_id = _.get(event, ['asset', 'token_id']);
                let event_id = _.get(event, ['id']);
                let totalPrice = _.get(event, 'total_price');
                let collection_slug = _.get(event, ['collection_slug']);
                let tokenName = _.get(event, ['asset', 'name']);
                let image = _.get(event, ['asset', 'image_url']);
                let openseaLink = _.get(event, ['asset', 'permalink']);
                let seller = _.get(event, ['seller', 'user', 'username']) || _.get(event, ['seller', 'address']);
                let usdValue = _.get(event, ['payment_token', 'usd_price']);
                let tokenSymbol = _.get(event, ['payment_token', 'symbol']);

                // check if necessary fields are defined
                if (event_id === undefined || asset_token_id === undefined ){
                    return "UndefinedEvent";
                }
                if (slug != collection_slug){
                    return "EventSlugInvalid";
                }
                // generate tokenName if not defined in Event
                if (tokenName == null) tokenName = `${collection_slug}_${asset_token_id}`;

                // logging Event Details
                console.log(`INFO ${slug}: New Sales Event found. ID: ${asset_token_id}, Token: ${tokenName}, ImageUrl: ${image}, OS: ${openseaLink}, Seller: ${seller}, Price: ${totalPrice}`);

                // here comes your code
            });
        }).catch((error) => {
            console.error(error);
        });
    }

// Intervall in ms
}, Number(config.globals.interval_time_ms) );