import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {
  Env
} from "../common/config/env-loader.js";

class AuthMiddleware {
  /**
   * Verifies the JWT token and sets the user ID and email in the request object
   * @param {import('express').Request} req - The request object
   * @param {import('express').Response} res - The response object
   * @param {Function} next - The next middleware function
   */
  async verifyToken(req, res, next) {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Missing Token!",
      });
    }

    jwt.verify(token, Env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid Token!'
        })
      }
      req.uid = decoded.uid
      req.email = decoded.email
      console.log(decoded)
      next();
    });
  }

  /**
   * Get a user by their ID
   * @param {Object} req - The request object
   * @param {string} req.uid - The user ID
   * @param {Object} res - The response object
   * @returns {Object} - The user data
   */
  async verifyUser(req, res, next) {
    try {
      const email = req.method === "GET" ? req.query.email : req.body.email;
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        res.status(404).json({
          success: false,
          message: "Can't find Email!",
        });
      }
      next();
    } catch (err) {
      console.log(err);
      res.status(404).json({
        success: false,
        message: err.message,
      });
    }
  }
}

export default new AuthMiddleware();