let axios = require('axios');

// config
let debug_enabled = false; if( process.env.DEBUG == "1" ) debug_enabled = true;
let globals = {
    debug: debug_enabled,
    interval_time_ms: Number(process.env.INTERVAL_MS) || 10000,
    search_back_min: Number(process.env.SEARCHBACK_MIN) || 20
}

// axios headers
axios.defaults.headers = {
    'Cache-Control': 'no-cache',
    'Connection': 'close',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Accept': '*/*'
};

module.exports = {
    axios: axios,
    globals: globals,
};
