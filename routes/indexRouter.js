import { Router } from "express";
import indexController from "../controllers/indexController.js";
import { isAuth, isNotAuth } from "../middleware/isAuth.js";
import { upload } from "../config/multer.js";
import {
  signUpValidationRules,
  validateRequest,
  signInValidationRules,
} from "../utils/validation/validateUserInput.js";

export const indexRouter = Router();

indexRouter.get("/", indexController.getHomePage);

indexRouter.get("/sign-up", isNotAuth, indexController.getSignUpForm);
indexRouter.post(
  "/sign-up",
  isNotAuth,
  signUpValidationRules(),
  validateRequest,
  indexController.postSignUp,
);

indexRouter.post(
  "/sign-in",
  isNotAuth,
  signInValidationRules(),
  validateRequest,
  indexController.postSignIn,
);

indexRouter.post("/sign-out", isAuth, indexController.postSignOut);

indexRouter.get("/about", indexController.getAboutPage);

indexRouter.post("/add-folder", isAuth, indexController.postFolder);

indexRouter.get("/:folderId", isAuth, indexController.getFolder);

indexRouter.get("/:fileId/install", indexController.getInstallFile);

indexRouter.post(
  "/delete-folder/:folderId",
  isAuth,
  indexController.postDeleteFolder,
);

indexRouter.post("/edit/:folderId", isAuth, indexController.postEditFolder);

indexRouter.get("/share/:folderId", indexController.getSharedFolder);

indexRouter.post(
  "/share/:folderId/share",
  isAuth,
  indexController.postShareFolder,
);

indexRouter.post(
  "/:folderId/add-file",
  isAuth,
  upload.single("file"), // multer memory storage
  indexController.postFile,
);

indexRouter.post(
  "/:folderId/:fileId/delete",
  isAuth,
  indexController.postDeleteFile,
);
