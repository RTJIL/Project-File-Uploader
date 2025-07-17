import { Router } from "express";
import indexController from "../controllers/indexController.js";
import passport from "../config/passport.js";
import { isAuth } from "../middleware/isAuth.js";

export const indexRouter = Router();

indexRouter.get("/", indexController.getHomePage);

indexRouter.post(
  "/sign-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
);

indexRouter.get("/sign-up", isAuth, indexController.getSignUpForm);
indexRouter.post("/sign-up", indexController.postSignUp);
