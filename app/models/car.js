'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  car.init({
    plate: DataTypes.STRING,
    manufacture: DataTypes.STRING,
    model: DataTypes.STRING,
    rentPerDay: DataTypes.INTEGER,
    capacity: DataTypes.INTEGER,
    description: DataTypes.STRING,
    availableAt: DataTypes.STRING,
    transmission: DataTypes.STRING,
    available: DataTypes.BOOLEAN,
    type: DataTypes.STRING,
    year: DataTypes.INTEGER,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN,
    deletedBy: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'car',
  });
  return car;
};