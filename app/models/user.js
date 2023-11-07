const Sequelize = require("sequelize");
const sequelize = require('../config/database')


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
 
}).catch(err=> console.log(err));

module.exports = { User, Signature, File}