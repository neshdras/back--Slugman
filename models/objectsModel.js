const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/database')


const Object = sequelize.define('objects' ,{
    name_object:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
})

module.exports = Object
