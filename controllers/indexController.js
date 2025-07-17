import queries from "../models/queries.js";
import bcrypt from "bcrypt";
import passport from "../config/passport.js";
import path from "node:path";
import { deleteOldSessions } from "../utils/sessionHelpers/sessionService.js";
import { formatFileSize, formatDate } from "../utils/formatters.js";
//
//sign-in form or folders page rendering at home page conditionally
const getHomePage = async (req, res) => {
  if (req.body) console.log("User signed in data: ", req.body);

  if (req.session) console.log("Session data: ", req.session);
  if (req.user) console.log("User passport data req.user: ", req.user);
  else console.log("Passport data:", req.user);

  console.log("----");

  if (req.isAuthenticated && req.isAuthenticated()) {
    const folders = await queries.findAll("folder");

    return res.render("pages/home", { folders });
  }

  return res.render("pages/home");
};

const getSignUpForm = (req, res) => {
  res.render("pages/forms/sign-up");
};

const getAboutPage = (req, res) => {
  res.render("pages/about");
};

const getFolder = async (req, res) => {
  const folderId = Number(req.params.folderId);

  if (isNaN(folderId)) {
    return res.status(400).send("Invalid folder ID");
  }

  console.log("folderId: ", folderId);
  try {
    const files = await queries.findAllWhere("file", {
      folderId,
    });
    return res.render("pages/folder", {
      folderId,
      files,
      formatFileSize,
      formatDate,
    });
  } catch (err) {
    console.error("❌ Get files error:", err);
  }
};

const getInstallFile = async (req, res) => {
  const id = Number(req.params.fileId);

  try {
    const file = await queries.findUnique("file", { id });

    if (!file) {
      return res.status(404).send("File not found");
    }

    const fullPath = path.resolve(file.path);

    if (!file) {
      return res.status(404).send("File not found");
    }

    res.download(fullPath, file.title, (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).send("Error downloading file");
      }
    });
  } catch (err) {
    console.error("❌ Get file error:", err);
    res.status(500).send("Server error");
  }
};

const postSignUp = async (req, res) => {
  console.log("User signed up data: ", req.body);
  console.log("----");

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Missing fields");
  }

  try {
    const isExist = await queries.findUnique("user", { username });

    if (isExist) return res.status(409).send("Username already taken");

    console.log("🔃Posting user to DB");

    const hashed = await bcrypt.hash(password, 10);
    queries.postUser(username, hashed);

    console.log("✅Completed");
    console.log("----");

    res.redirect("/");
  } catch (err) {
    console.error("❌ Sign up error:", err);
  }
};

const postSignOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
};

const postSignIn = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/");

    try {
      await deleteOldSessions(user.id);

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect("/");
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

const postFolder = async (req, res) => {
  const { title } = req.body;
  const { id } = req.user;

  try {
    await queries.postFolder(title, id);
    return res.redirect("/");
  } catch (err) {
    console.error("❌ Post folder error:", err);
  }
};

const postDeleteFolder = async (req, res) => {
  const id = Number(req.params.folderId);

  if (isNaN(id)) {
    return res.status(400).send("Invalid folder ID");
  }

  try {
    await queries.deleteSome("folder", { id });
    return res.redirect("/");
  } catch (err) {
    console.error("❌ Delete folder error:", err);
  }
};

const postDeleteFile = async (req, res) => {
  const id = Number(req.params.fileId);
  const folderId = req.params.folderId;

  console.log(id);

  if (isNaN(id)) {
    return res.status(400).send("Invalid folder ID");
  }

  try {
    await queries.deleteSome("file", { id });
    return res.redirect(`/${folderId}`);
  } catch (err) {
    console.error("❌ Delete folder error:", err);
  }
};

const postEditFolder = async (req, res) => {
  const id = Number(req.params.folderId);
  const { edit } = req.body;

  try {
    await queries.updateSome("folder", { id }, { title: edit });
    return res.redirect("/");
  } catch (err) {
    console.error("❌ Edit folder error:", err);
  }
};

const postFile = async (req, res) => {
  console.log("File: ", req.file);

  const { originalname, size, path } = req.file;
  const id = Number(req.params.folderId);

  console.log("File data: ", req.file);

  // const timeCreated = new Date();
  // const fortmattedTime = timeCreated.toLocaleDateString();

  try {
    await queries.postFile(originalname, size, id, path);
    return res.redirect(`/${id}`);
  } catch (err) {
    console.error("❌ Post folder error:", err);
  }
};

export default {
  getHomePage,
  getSignUpForm,
  getAboutPage,
  getFolder,
  getInstallFile,
  postSignUp,
  postSignOut,
  postSignIn,
  postFolder,
  postDeleteFolder,
  postDeleteFile,
  postEditFolder,
  postFile,
};

/**
 * 4. Optional: track sessions per user & remove old ones on login
If you want only 1 active session per user, you can:

Store userId inside the session row (in passport.serializeUser)

On login, query sessions for that user

Delete the old ones

This is more advanced — but I can hook you up with that logic if you're down
 */

/**
 * const authenticate = (strategy, callback) => {
  return (req, res, next) => {
    // do auth logic here
    callback(null, user, info);
  };
};
 */

/**
 * passport.authenticate(...) self-call
→ (req, res, next) passed in
→ Passport authenticates user with strategy (e.g. local)
→ If success: serializeUser → session saved
→ Calls your callback (err, user, info)
→ You handle response (log in user, redirect, etc)
 */
