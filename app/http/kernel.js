require('dotenv').config()
const http = require('http');
const bodyParser = require('body-parser');
const setRoutes = require('../routes/index');
const path = require('path');
// const myPlugin = require('myPlugin')

/**
 * This is de api configuration file
 * If you want to use 3rd party plugins, require them in this file
 * @param app
 */

const setConfig = (app) => {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../views'));

    // app.use(myPlugin)
}

/**
 * Starts the application
 * @param app
 * @return {Promise<void>}
 */
const run = async (app) => {
    console.log('Setting kernel config..')
    await setConfig(app)
    console.log('Setting routes...')
    await setRoutes(app)
    console.log('Creating server..')
    const server = http.createServer(app);
    server.listen(process.env.PORT || 3000);
    console.log(`Server running on port ${process.env.PORT}`)
}

module.exports = run
