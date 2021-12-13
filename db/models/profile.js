'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {foreignKey: "userId", as: "user"})
    }

    toJSON() {
      return {...this.get(), id: undefined, userId: undefined}
    }
  };
  Profile.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    gender: DataTypes.STRING,
    phone: DataTypes.STRING,
    dob: DataTypes.DATEONLY,
    country: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
    tableName: "profiles",
  });
  return Profile;
};