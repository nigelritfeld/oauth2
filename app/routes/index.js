// Imported route groups
const home = require('./home')
const oauth = require('./oauth')
const dev = require('./testRoutes')
const login = require('./login')
/**
 * In this function the routes will be bound to the global router.
 * You can create a route group with express routers like in example home.js
 * @param app
 */
const setRoutes = (app) => {
    app.use('/', login)
    app.use('/oauth', oauth)
    // if (process.env.MODE === 'development') {
    //     app.use('/test/', dev)
    // }

}
module.exports = setRoutes
