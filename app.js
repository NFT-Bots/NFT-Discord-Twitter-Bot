// required modules
let _ = require('lodash');
let moment = require('moment');
let config = require('./config');
let axios = config.axios;

// get opensea events
async function get_os_events(slug, mode){
    let searchBack = config.globals.search_back_min;
    let occurred_after = moment().startOf('minute').subtract(searchBack, "minutes").unix();
    let event_type_string = null;

    // mode is defining if Sales or Listings events should be retrieved
    if( mode == "sales" ){
        event_type_string = 'successful';
    } else if( mode == "listings" ){
        event_type_string = 'created';
    } else {
        console.log(`ERROR ${slug}: Invalid mode specified: ${mode}`)
        return "invalidMode"
    }

    // get all Listings Events from Opensea
    axios.get('https://api.opensea.io/api/v1/events', {
        params: {
            collection_slug: slug,
            event_type: event_type_string,
            occurred_after: occurred_after,
            only_opensea: 'true'
        }
    }).then((response) => {
        let events = _.get(response, ['data', 'asset_events']);
        console.log(`${slug}: ${events.length} Listings in the last ${searchBack} seconds.`);

        // parsing Listings Events
        _.each(events, (event) => {
            return process_os_event(event, mode)
        });
    }).catch((error) => {
        console.error(error);
    });
}

async function process_os_event(event, mode){
    // extract data from opensea Event
    let asset_token_id = _.get(event, ['asset', 'token_id']);
    let event_id = _.get(event, ['id']);
    let collection_slug = _.get(event, ['collection_slug']);
    let tokenName = _.get(event, ['asset', 'name']);
    let image = _.get(event, ['asset', 'image_url']);
    let openseaLink = _.get(event, ['asset', 'permalink']);
    let seller = _.get(event, ['seller', 'address']);
    let usdValue = Number(_.get(event, ['payment_token', 'usd_price'])).toFixed(2);

    // check if necessary fields are defined
    if (event_id === undefined || asset_token_id === undefined ){
        return "UndefinedEvent";
    }
    // generate tokenName if not defined in Event
    if (tokenName == null) tokenName = `${collection_slug}_${asset_token_id}`;

    // logging Event Details
    console.log(`INFO ${collection_slug}: New ${mode} event found. ID: ${asset_token_id}, Token: ${tokenName}, ImageUrl: ${image}, OS: ${openseaLink}, Seller: ${seller}, Price: ${usdValue}$`);

    // here comes your code
}

// main loop
setInterval(() => {
    // slug config to be checked
    let sluglist = [ "thecryptomoms", "topdogbeachclub", "cryptocannabisclub", "punkscapes" ];
    for(const slug of sluglist) {
        // calculating unix timestamp to search Events since the given Timestamp
        let searchBack = config.globals.search_back_min;
        let occurred_after = moment().startOf('minute').subtract(searchBack, "minutes").unix();

        // now process Sales and Listings Events for the above sluglist
        get_os_events(slug, "sales")
        get_os_events(slug, "listings")
    }
// Intervall in ms
}, Number(config.globals.interval_time_ms) );