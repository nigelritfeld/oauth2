const express = require('express')
const router = express.Router()
const UserController = require('../http/controller/userController')
const {
    createAndSignToken,
    createJWKS, verifyToken,
} = require('../helpers/jose/jwt')

router.get('/keys/', async (req, res) => {
    // Creating new public/private key pair and Json Web Key Set
    const {publicJWK, privateJWK, publicKey, privateKey,} = await createJWKS()
    // Example created user
    const user = {
        name: 'nigel',
        email: 'nigel@ritfeld.nl',

    }
    // Encrypting data with new private key
    // const message = await encryptMessage(user, privateKey)
    // Creating new signed token with data and private key
    const token = await createAndSignToken({user}, privateKey)
    const clientPublicKey = Buffer.from(JSON.stringify(publicJWK, 'utf-8'))

    res.json({
        token,
        publicKey: clientPublicKey.toString('base64'),
    }).status(201)
})
router.post('/validate/token', async (req, res) => {
    // const {accessToken, privateKey} = req.body
    try
    {
        const token = req.get('authorization').replace('Bearer ', '')
        const {payload, protectedHeader} = await verifyToken(token , process.env.JWK_PUBLIC_KEY)
        console.log(typeof token)
        console.log(payload, protectedHeader)
        res.json({
            token: {payload, protectedHeader}
        }).status(200)
    }
    catch (e) {
        console.log(e)
        res.json({message:e.message}).status(403)
    }


})


module.exports = router
