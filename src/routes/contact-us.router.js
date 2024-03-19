import express from "express";
import ContactController from "../controller/contact-us.controller.js";

const ContactRouter = express.Router();

ContactRouter.post("/message", ContactController.createContact);

export default ContactRouter;