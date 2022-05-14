const run = require('./http/kernel')
const express = require('express');
const app = express();
class Api {

    app = app

    constructor() {
        run(this.app).then(r => console.log({
            status: 'App successfully started',
            url: `http://${process.env.HOST}:${process.env.PORT}/`,
        }))
    }

}
module.exports = Api
