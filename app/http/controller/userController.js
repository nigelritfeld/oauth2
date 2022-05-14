const {DataTypes} = require('sequelize');
const database = require('../../database/database')
const UserMaker = require('../../models/user')
const User = UserMaker(database, DataTypes)
const bcrypt = require('bcrypt');
const {createAndSignToken} = require("../../helpers/jose/jwt");

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

class UserController {

    /**
     * Get user
     * @return {Promise<*>}
     * @param email
     */
    static async getUser(email)
    {
        try{
            return User.findOne({
                where: {
                    email: email
                }
            })
        }
        catch (e) {
            console.log(e.message)
            return e.message
        }
    }

    /**
     * Login user en returns token
     * @param req
     * @param res
     * @return {Promise<*>}
     */
    static async loginUser(req, res)
    {
        // Destructing request body
        const {email, password} = req.body
        // Check if correct values were passed
        if (!email|| !password ) return res.status(403).json({
            message: 'Oeps you forgot to specify user email or password',
        })
        try{
            // Searching for user based on email
            const user = await this.getUser(email)
            // If there is no user found return
            if (!user) return res.status(403).json({
                message: 'Wrong credentials',
            })
            // Verify user password
            const verified = await this.comparePassword(password, user.password)
            // If user not verified return
            if (!verified) return res.status(403).json({
                message: 'Wrong credentials',
            })
            // Create JWT Token
            const token = await createAndSignToken({user}, process.env.JWK_PRIVATE_KEY)
            console.log(`Created new token for ${user.email}`)
            // Return token
            return res.status(200).json({
                message: 'User authenticated',
                accesToken: token,
                accessTokenExpirationDate: (new Date().addHours(672))
            })
        }catch (e) {
            res.status(500).json({
                error:e.message
            })
        }

    }


    /**
     * Creates new user in database and returns signed token
     * @param req
     * @param res
     * @return {Promise<*>}
     */
    static async createUser(req, res) {
        // Creating database transaction
        const t = await database.transaction();
        try {
            // Destructing request body
            const {name, email, password} = req.body;
            // Hashing input password
            const passwordHash = await this.hashPassword(password)
            // Looking if user already exists in database
            const [user, createdUser] = await User.findOrCreate({
                where: {email: email},
                defaults: {name: name, email: email, password: passwordHash}
            });
            // If no user was created return
            if (!createdUser) return res.status(409).json({
                message: 'Failed to create new user'
            });
            // Creating new signed token with data and private key
            const token = createdUser ? await createAndSignToken({user}, process.env.JWK_PRIVATE_KEY) : null
            // Retuning response with created user and signed token
            res.status(201).json({
                message: 'Created user',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    token: {
                        accesToken: token,
                        accessTokenExpirationDate: (new Date().addHours(672)),
                    }
                }
            })
        }
        catch (e) {
            // Removing transaction
            await t.rollback();
            console.log(e.message)
            return res.status(409).json({
                message: 'Failed to create new user'
            });
        }
    }

    /**
     * Verifies password
     * @param password
     * @param hash
     * @return {Promise<boolean|void|*|NodeJS.Global.Promise>}
     */
    static async comparePassword (password, hash) {
        try {
            // Compare password
            return await bcrypt.compare(password, hash);
        } catch (error) {
            console.log(error);
        }
        // Return false if error
        return false;
    };

    /**
     * Creates hash from plain text password
     * @param password
     * @param saltRounds
     * @return {Promise<null|void|*|NodeJS.Global.Promise>}
     */
    static async hashPassword (password, saltRounds = 10) {
        try {
            // Generate a salt
            const salt = await bcrypt.genSalt(saltRounds);
            // Hash password
            return await bcrypt.hash(password, salt);
        } catch (error) {
            console.log(error);
        }
        // Return null if error
        return null;
    };
}

module.exports = UserController
