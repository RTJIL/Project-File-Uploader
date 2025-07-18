import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "url";
import ejsLayouts from "express-ejs-layouts";
import { indexRouter } from "./routes/indexRouter.js";
import { PORT } from "./config/env.js";
import { sessionMid } from "./config/session.js";
import passport from "./config/passport.js";
import { authInfo } from "./middleware/authInfo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//setting up express server
const app = express();

//setting ejs template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// ejs templates
app.use(ejsLayouts);
app.set("layout", "layout");

//serving static assets
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

//serve file installation
app.use("/uploads", express.static("uploads"));

//parsing data from form
app.use(express.urlencoded({ extended: true }));

//proxy set-up for secure cookies
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

//session init
app.use(sessionMid);
app.use(passport.session());
app.use(authInfo);

//serving index route
app.use("/", indexRouter);

app.use((req, res) => {
  res.status(404).render('pages/404');
});

app.use((err, req, res, next) => {
  console.error("💥 Global error caught:", err);
  res.status(500).send("⛔ Server side error");
});

app.listen(PORT, () => console.log("Server started on port: ", PORT));