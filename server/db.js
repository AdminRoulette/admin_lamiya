const {Sequelize} = require('sequelize')
if (process.env.NODE_ENV === "production") {

    module.exports = new Sequelize({
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true, // This will help you. But you will see nwe error
                rejectUnauthorized: false // This line will fix new error
            }
        },
    });
}else {
    module.exports = new Sequelize(
        process.env.DB_NAME_DEV,
        process.env.DB_USER_DEV,
        process.env.DB_PASSWORD_DEV,
        {
            dialect: 'postgres',
            host: process.env.DB_HOST_DEV,
            port: process.env.DB_PORT,
        }
    )
}
