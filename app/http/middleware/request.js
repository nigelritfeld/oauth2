const request =  (req,res, next) => {

    // Check if content-type header is set
    if (req.headers["content-type"] !== 'application/json' )return res
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        .status(400)
        .json({
            status : 400,
            message: 'Request header Content-type: Missing or not set to "application/json"'
        })

    // Check if accept header is set
    if (req.headers["accept"] !== 'application/json' )return res
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        .status(400)
        .json({
            status : 400,
            message: 'Request header Accept: Missing or not set to "application/json"'
        })

    next()
}

module.exports = request
