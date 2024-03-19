import User from "../models/user.model.js";
import Contact from "../models/contact-us.model.js";

class ContactController {
  async createContact(req, res) {
    try {
      const {
        name,
        email,
        message,
        userId
      } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      await Contact.create({
        name,
        email,
        message,
        userId, // Save userId as relation
      });

      res.status(201).json({
        success: true,
        message: 'Message sent successfully'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default new ContactController();