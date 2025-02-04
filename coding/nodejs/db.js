// 載入套件
const {Sequelize} = require("sequelize");

// 連結資料庫
const db = new Sequelize("ccsrdd", process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    operatorsAliases: false,
    pool: {
        max: 10,
        min: 1,
        acquire: 30000,
        idle: 1000
    }
});

module.exports = {db, Sequelize};