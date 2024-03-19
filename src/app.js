import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import {
	Env
} from "./common/config/env-loader.js";
import * as dotenv from "dotenv";
dotenv.config();
import AuthRouter from './routes/auth.router.js';
import UserRouter from './routes/users.router.js';
import ContactRouter from './routes/contact-us.router.js';
import morgan from 'morgan';


const app = express();
const globalApiPrefix = "/api";

app.use(globalApiPrefix, express.json());
app.use(cookieParser())
app.use(morgan('tiny'))
app.disable('x-powered-by') 
app.use(cors({
	credentials: true,
	origin: "*",
}));

app.use(`${globalApiPrefix}/`,
	express.Router()
		.use("/auth", AuthRouter)
		.use("/user", UserRouter)
		.use("/contact", ContactRouter)
);


app.use("/", (req, res) => {
	console.log("Server is listening");
	res.send("Response Success");
});

const port = Env.PORT;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});