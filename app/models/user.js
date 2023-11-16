const Sequelize = require("sequelize");
const sequelize = require('../config/database')
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(`http://${process.env.GETH_HOST}:8545`));

const User = sequelize.define("user", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    wallet:{
      type:Sequelize.STRING,
      allowNull: false
    },
    name:{
      type:Sequelize.TEXT,

    },
    isAdmin:{
      type:Sequelize.BOOLEAN,
      default:false
    }
  });

const File = sequelize.define("file", {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name:{
    type:Sequelize.TEXT,

  },
  path:{
    type:Sequelize.TEXT,
  },
  status:{
    type:Sequelize.BOOLEAN,
    default:false
  }
});

const Signature = sequelize.define("signature", {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  hash:{
    type:Sequelize.TEXT,

  }
});

File.belongsToMany(User, {through:Signature})
User.belongsToMany(File, {through:Signature})



sequelize.sync({force: false}).then(async function (result){
    let user = await User.findOne({where:{name:process.env.ADMIN_NAME}})
    if(!user){
    let wall = await web3.eth.personal.newAccount(process.env.ADMIN_PASS)
    let admin = await User.create({
        name:process.env.ADMIN_NAME,
        wallet:wall,
        isAdmin:true
    })
    }
}).catch(err=> console.log(err));

module.exports = { User, Signature, File}