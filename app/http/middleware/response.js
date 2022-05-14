const response =  (req,res, next) => {
    res
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
}

module.exports = response
