import {
  Model,
  DataTypes
} from "sequelize";
import {
  sequelize
} from "../common/database/sequelize.js";

class User extends Model {}

User.init({
  uid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
  },
  //image: {
  //  type: DataTypes.STRING,
  //},
}, {
  sequelize,
  modelName: "user",
});

export default User;