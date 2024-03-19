import {
  Model,
  DataTypes
} from "sequelize";
import {
  sequelize
} from "../common/database/sequelize.js";
import User from './user.model.js'; // Import model User


class Contact extends Model {}

Contact.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User, // Referensi model User
        key: 'id', // Kolom id di model User
      },
    },
  },
  {
    sequelize,
    modelName: 'contact_us',
  }
);

export default Contact;
