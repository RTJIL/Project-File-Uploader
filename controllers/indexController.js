import queries from "../models/queries.js";
import bcrypt from "bcrypt";
import passport from "../config/passport.js";
import { deleteOldSessions } from "../utils/sessionHelpers/sessionService.js";
import { formatFileSize, formatDate } from "../utils/formatters.js";
import { supabase } from "../config/supabase.js";
import "dotenv/config";
import axios from "axios";

//sign-in form or folders page rendering at home page conditionally
const getHomePage = async (req, res) => {
  try {
    if (process.env.NODE_ENV === "development") {
      if (req.body) console.log("User signed in data:", req.body);
      if (req.session) console.log("Session data:", req.session);
      console.log("User passport data req.user:", req.user);
      console.log("----");
    }

    if (req.isAuthenticated && req.isAuthenticated()) {
      const { id } = req.user;
      const folders = await queries.findAllWhere("folder", { userId: id });
      return res.render("pages/home", { folders });
    }

    return res.render("pages/home", { folders: [], errors: [] });
  } catch (error) {
    console.error("Error fetching home page:", error);
    return res.status(500).send("Something went wrong.");
  }
};

const getSignUpForm = (req, res) => {
  res.render("pages/forms/sign-up", { errors: [] });
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
    const files = await queries.findAllWhere(
      "file",
      {
        folderId,
      },
      { uploadTime: "desc" },
    );
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
    if (!file) return res.status(404).send("File not found");

    const bucketName = process.env.SUPABASE_BUCKET;
    let key = file.path;
    if (file.path.startsWith("http")) {
      key = file.path.split(`/${bucketName}/`)[1];
    }

    const { data: signedUrlData, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(key, 60);

    if (error) {
      console.error(error);
      return res.status(500).send("Failed to get signed URL");
    }

    const response = await axios({
      url: signedUrlData.signedUrl,
      method: "GET",
      responseType: "stream",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.title}"`,
    );
    res.setHeader("Content-Type", response.headers["content-type"]);

    response.data.pipe(res);
  } catch (err) {
    console.error(err);
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

    if (isExist) {
      return res.status(409).render("pages/forms/sign-up", {
        errors: [{ msg: "Username already taken" }],
        oldInput: req.body,
      });
    }

    console.log("🔃Posting user to DB");

    const hashed = await bcrypt.hash(password, 10);
    queries.postUser(username, hashed);

    console.log("✅Completed");
    console.log("----");

    res.redirect("/");
  } catch (err) {
    console.error("❌ Sign up error:", err);
    res.status(500).render("pages/forms/sign-up", {
      errors: [{ msg: "Something went wrong, please try again." }],
      oldInput: req.body,
    });
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

    if (!user) {
      return res.status(401).render("pages/forms/sign-in", {
        errors: [{ msg: info.message || "Incorrect username or password" }],
        oldInput: req.body,
      });
    }

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

/* const postDeleteFolder = async (req, res) => {
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
}; */

const postDeleteFolder = async (req, res) => {
  const folderId = Number(req.params.folderId);

  if (isNaN(folderId)) {
    return res.status(400).send("Invalid folder ID");
  }

  try {
    const files = await queries.findAllWhere("file", { folderId });

    if (files.length > 0) {
      const fileKeys = files.map((file) => file.path);

      const { error: supaError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .remove(fileKeys);

      if (supaError) {
        console.error("Supabase delete error:", supaError);
        return res.status(500).send("Failed to delete files from storage");
      }
    }

    await queries.deleteSome("folder", { id: folderId });

    res.redirect("/");
  } catch (err) {
    console.error("❌ Delete folder error:", err);
    res.status(500).send("Server error");
  }
};

const postDeleteFile = async (req, res) => {
  const id = Number(req.params.fileId);
  const folderId = req.params.folderId;

  if (isNaN(id)) {
    return res.status(400).send("Invalid file ID");
  }

  try {
    const fileRecord = await queries.findUnique("file", { id });

    if (!fileRecord) {
      return res.status(404).send("File not found");
    }

    // Remove file from Supa
    const { error: supaError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .remove([fileRecord.path]);

    if (supaError) {
      console.error("Supabase delete error:", supaError);
      return res.status(500).send("Failed to delete file from storage");
    }

    await queries.deleteSome("file", { id });

    return res.redirect(`/${folderId}`);
  } catch (err) {
    console.error("❌ Delete file error:", err);
    res.status(500).send("Server error");
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
  try {
    const file = req.file; // multer
    const fileName = `${Date.now()}-${file.originalname}`;
    const folderId = Number(req.params.folderId);

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      return res
        .status(500)
        .json({ error: "Upload to Supabase failed", details: error.message });
    }

    const { data: urlData } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(fileName);

    const fileUrl = urlData.publicUrl;

    const savedFile = await queries.postFile(
      file.originalname,
      file.size,
      folderId,
      fileName,
    );

    res.redirect(`/${folderId}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
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
