/**
 * @file AuthController.js
 * @description File containing AuthController class
 */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import {
  Env
} from "../common/config/env-loader.js";
import {
  nanoid
} from "nanoid";

/**
 * @class AuthController
 * @description AuthController class
 */
class AuthController {
  /**
   * @function Register
   * @description Register a new user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {JSON} JSON object
   */
  async Register(req, res) {
    try {
      const {
        name,
        email,
        password,
        confirmPassword
      } = req.body;
      if (!name || !email || !password || !confirmPassword) {
        res.status(400).json({
          success: true,
          error: "Please provide all required fields",
        });
      }

      const existUser = await User.findOne({
        where: {
          email
        },
      });
      if (existUser) {
        res.status(400).json({
          success: false,
          message: `User with ${email} already exist`,
        });
      }
      if (!email.includes("@")) {
        res.status(400).json({
          success: false,
          message: "Email format is invalid!",
        });
      }
      if (password.length < 8) {
        res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters!",
        });
      }
      if (password !== confirmPassword) {
        res.status(403).json({
          success: false,
          message: "Password and confirm password don't match!",
        });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const id = nanoid(10);
      const uid = "user-" + id;

      await User.create({
        uid: uid,
        name: name,
        email: email,
        password: hashedPassword,
      });
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        payload: {
          name,
          email,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * @function Login
   * @description Login an existing user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {JSON} JSON object
   */
  async Login(req, res) {
    try {
      const {
        email,
        password
      } = req.body;

      const user = await User.findOne({
        where: {
          email
        },
      });

      if (!user) {
        res.status(401).json({
          success: false,
          message: "User not registered",
        });
        return;
      }

      const uid = user.uid;
      const name = user.name;

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }

      const accessToken = jwt.sign({
        uid,
        name,
        email
      }, Env.JWT_SECRET, {
        expiresIn: "24h",
      });

      const refreshToken = jwt.sign({
        uid,
        name,
        email
      }, Env.JWT_SECRET, {
        expiresIn: "7d",
      });

      await User.update({
        token: refreshToken
      }, {
        where: {
          uid: uid
        }
      });
      res.cookie('token', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        samSite: 'none',
        secure: false,
      })

      res.status(200).json({
        success: true,
        message: 'Login Successfully!',
        payload: {
          uid,
          name,
          email,
          token: accessToken,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * @function Logout
   * @description Logout an existing user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {JSON} JSON object
   */
  async Logout(req, res) {
    const refreshToken = req.cookies.token
    if (!refreshToken) {
      return res.status(204).json({
        success: true,
        message: 'No content available'
      })
    }
    const user = await User.findAll({
      where: {
        token: refreshToken
      },
    })
    if (!user[0]) {
      return res.status(204).json({
        success: true,
        message: 'No content available!'
      })
    }
    const uid = user[0].uid
    await User.update({
      token: null
    }, {
      where: {
        uid: uid
      }
    })
    res.clearCookie('refreshToken')
    return res.status(200).json({
      success: true,
      message: 'Logout Success!'
    })
  }

  /**
   * @function RefreshToken
   * @description Refresh the access token of an existing user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {JSON} JSON object
   */
  async RefreshToken(req, res) {
    try {
      console.log('cookie => ', req.cookies)
      //const { token } = req.body;
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        })
      }
      // Temukan user berdasarkan refresh token
      const user = await User.findOne({
        where: {
          token
        },
      });

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
        return;
      }

      jwt.verify(token, Env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden'
          })
        }
        const uid = user.uid
        const name = user.name
        const email = user.email
        const refreshToken = jwt.sign({
            uid,
            name,
            email
          },
          Env.JWT_SECRET, {
            expiresIn: '24h'
          })
        res.status(200).json({
          success: true,
          payload: {
            token: refreshToken
          }
        })
      })

    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export default new AuthController();