const Sequelize = require("sequelize");
const sequelize = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`)/*process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host:"postgres",
  dialect: "postgres"
});*/

module.exports = sequelize