import { Router } from "express";
import indexController from "../controllers/indexController.js";
import { isAuth } from "../middleware/isAuth.js";
import { upload } from "../config/multer.js";

export const indexRouter = Router();

indexRouter.get("/", indexController.getHomePage);

indexRouter.get("/sign-up", isAuth, indexController.getSignUpForm);
indexRouter.post("/sign-up", indexController.postSignUp);

indexRouter.post("/sign-in", indexController.postSignIn);

indexRouter.post("/sign-out", indexController.postSignOut);

indexRouter.get("/about", indexController.getAboutPage);

indexRouter.post("/add-folder", indexController.postFolder);

indexRouter.get("/:folderId", isAuth, indexController.getFolder);

indexRouter.get("/:fileId/install", indexController.getInstallFile)

indexRouter.post("/delete-folder/:folderId", indexController.postDeleteFolder);

indexRouter.post("/edit/:folderId", indexController.postEditFolder);

indexRouter.post(
  "/:folderId/add-file",
  upload.single("file"),
  indexController.postFile,
);

indexRouter.post("/:folderId/:fileId/delete", indexController.postDeleteFile);
