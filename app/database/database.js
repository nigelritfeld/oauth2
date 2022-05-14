
const {Sequelize} = require('sequelize');
const sequelize = process.env.MODE === 'development' ?
    new Sequelize(process.env.DEV_DATABASE_NAME, process.env.DEV_DATABASE_USER, process.env.DEV_DATABASE_PASSWORD,{
    dialect: 'mariadb',
    host: `${process.env.DEV_DATABASE_HOST}` ,
    port: `${process.env.DEV_DATABASE_PORT}`,
    dialectOptions: {
        // Your mariadb options here
        connectTimeout: 1000
    }
}):
    new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD,{
        dialect: 'mariadb',
        host: `${process.env.DATABASE_HOST}` ,
        port: `${process.env.DATABASE_PORT}`,
        dialectOptions: {
            // Your mariadb options here
            connectTimeout: 1000
        }});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
    module.exports = sequelize
    return sequelize
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

