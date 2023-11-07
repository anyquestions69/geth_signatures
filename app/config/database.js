const Sequelize = require("sequelize");
const sequelize = new Sequelize(`postgres://${'public_hysteria'}:${'0666'}@${'localhost'}:5432/${'61kaf'}`)/*process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host:"postgres",
  dialect: "postgres"
});*/

module.exports = sequelize