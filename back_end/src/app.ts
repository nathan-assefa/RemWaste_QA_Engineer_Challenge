import express, { Application } from "express";
const cookieParser = require("cookie-parser");
const cors = require("cors");
import authRoutes from "./routes/authRoutes";
import itemRoutes from "./routes/itemRoutes";
import bodyParser from "body-parser";

const app: Application = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
  exposedHeaders: "Authorization",
};

app.use(cors(corsOptions));

app.use(authRoutes);
app.use(itemRoutes);

export default app;
