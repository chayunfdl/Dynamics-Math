import User from "../models/user.model.js"

class UserController {
  /**
   * Get a user by their ID
   * @param {Object} req - The request object
   * @param {string} req.uid - The user ID
   * @param {Object} res - The response object
   * @returns {Object} - The user data find by uid
   */
  async getUser(req, res) {
    try {
      const user = await User.findOne({
        attributes: ['uid', 'name', 'email'],
        where: {
          uid: req.uid
        },
      })
      console.log("data => ", user)
      res.status(200).json({
        success: true,
        payload: user,
      })
    } catch (err) {
      console.log(err)
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user data!',
      })
    }
  }
}

export default new UserController()