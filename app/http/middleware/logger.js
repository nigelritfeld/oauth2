const {getRequestIpAddress} = require('../../helpers/request-ip-addres');

const logger = (req, res, next) => {
    const clientIp = getRequestIpAddress(req)
    console.log({
        'Type': 'Request',
        'Client': clientIp,
        'Path': req.path,
        'Time': Date.now(),
    })
    next()
}
module.exports = logger
