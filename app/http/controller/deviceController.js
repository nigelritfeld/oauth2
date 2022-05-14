const {DataTypes} = require('sequelize');
const database = require('../../database/database')
const DeviceMaker = require('../../models/device')
const DeviceConnectionMaker = require('../../models/device_connections')
const Device = DeviceMaker(database, DataTypes)
const DeviceConnection = DeviceConnectionMaker(database, DataTypes)
const {verifyToken} = require("../../helpers/jose/jwt");


class DeviceController {
    /**
     * Register device in database based on user JWT Token
     * @param req
     * @param res
     * @return {Promise<void>}
     */
    static async registerDevice(req, res) {
        // If no authorization header is given
        if (!req.headers.authorization) return res.status(403).json({
            error: 'Not authorized to access resource'
        });
        // Get device ID from request
        const {deviceID} = req.body;
        if (!deviceID) return res.status(403).json({
            error: 'Not authorized to access resource'
        });
        const t = await database.transaction()
        try {
            // Register new device in database
            const [registeredDevice] = await Device.findOrCreate({
                where: {physical_id: deviceID},
                defaults: {physical_id: deviceID}
            });
            // Extracting token from Authorization header
            const token = req.headers.authorization.replace('Bearer ', '');
            // Verifying token
            const {payload} = await verifyToken(token, process.env.JWK_PUBLIC_KEY);
            // Create new user device relation
            const [connection] = await DeviceConnection.findOrCreate({
                where: {
                    user_id: payload.user.id,
                    device_id: parseInt(registeredDevice.id)
                }, defaults: {
                    user_id: payload.user.id,
                    device_id: parseInt(registeredDevice.id)
                }
            });
            // Respond with created record
            res.status(201).json({
                deviceConnection: connection,
                device_id: connection.device_id
            });
        } catch (e) {
            t.rollback()
            res.status(403).json({
                error: e.message
            });
            console.log(e.message)
        }
    }
}

module.exports = DeviceController
