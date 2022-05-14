const jose = require("jose");
const crypto = require('crypto');
require('dotenv').config()
/**
 * Site used to create Json Web Keys(JWK) pairs
 * https://mkjwk.org/
 */

/**
 * Imports JWK Key from base64
 * @param key
 * @param alg
 * @return {Promise<{key}>}
 */
const importKey = async (key, alg = 'ES256') => {
    // const ecPublicKey = await jose.importJWK('sd', 'ES256')
    const JWK = await JSON.parse(atob(key))
    const privateKey = await jose.importJWK(JWK, alg)
    return {key}
}

/**
 * Function to generate RSA Key pair
 */
const generateRSAKeyPair = async (passphrase) => {
    try {
        let options = {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                // cipher: 'aes-256-cbc',
                // passphrase: passphrase
            }
        };
        let start = Date.now();
        return { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', options, (err, publicKey, privateKey) => {
            let end = Date.now();
            console.log("\n> Generated RSA keys " + (end - start) + " milliseconds.");
        })
    } catch (e) {
        console.log(e)
    }

}

/**
 * Generates JsonWebKeys
 * @param publicKey
 * @param privateKey
 * @return {Promise<{privateJWK: KeyLike, publicJWK: KeyLike}>}
 */
const createJWKS = async () => {
    console.log("createJWKS");
    // Generated keys in .pem format
    const { publicKey, privateKey } = await generateRSAKeyPair('passs');
    // Imported keys in Key objects
    const ecPublicKey = await jose.importSPKI(publicKey, 'ES256');
    const ecPrivateKey = await jose.importPKCS8(privateKey, 'ES256');
    // Exported keys to Json Web Keys
    const publicJwk = await jose.exportJWK(ecPublicKey);
    const privateJwk = await jose.exportJWK(ecPrivateKey);


    console.log({
        public: btoa(JSON.stringify(publicJwk)),
        private: btoa(JSON.stringify(privateJwk)),
    })

    return {
        publicJWK: publicJwk,
        publicJWK: privateJwk,
        publicKey: ecPrivateKey,
        privateKey: ecPrivateKey,
    }
}

/**
 * Creates JWT Token
 * @return {Promise<string>}
 * @param payload
 * @param privateKey
 */
const createAndSignToken = async (payload, privateKey) => {
    const decodedKey = JSON.parse(atob(privateKey))
    const key = await jose.importJWK(decodedKey, 'ES256')
    return await new jose.SignJWT(payload)
        .setProtectedHeader({alg: 'RS256'})
        .setIssuedAt()
        .setIssuer('app')
        .setAudience('api:claire')
        .setExpirationTime('672h')
        .sign(key)
}

/**
 * Encrypts message
 * @param message
 * @param key
 * @return {Promise<string>}
 */
const encryptMessage = async (message, key) => {
    return await new jose.CompactEncrypt(new TextEncoder().encode(message))
        .setProtectedHeader({alg: 'RSA-OAEP-256', enc: 'A256GCM'})
        .encrypt(key)
}

/**
 * Verifies JWT
 * @param token
 * @param publicKey
 * @return {Promise<{payload: JWTPayload, protectedHeader: JWTHeaderParameters}>}
 */
const verifyToken = async (token, publicKey) => {
    const decodedKey = JSON.parse(atob(publicKey))
    const key = await jose.importJWK(decodedKey, 'ES256')
    const {payload, protectedHeader} = await jose.jwtVerify(token, key, {
        audience: 'api:claire'
    })
    return {payload, protectedHeader}
}

/**
 * Decrypts JWE Token
 * @param jwe
 * @param key
 * @return {Promise<string>}
 */
const decryptMessage = async (jwe, key) => {
    const {plaintext, protectedHeader} = await jose.compactDecrypt(jwe, key)
    return new TextDecoder().decode(plaintext)
}

module.exports = {
    createAndSignToken,
    encryptMessage,
    verifyToken,
    decryptMessage,
    generateRSAKeyPair,
    createJWKS,
    importKey
}
