import queries from "../models/queries.js";
import bcrypt from "bcrypt";

//sign-in form or folders page rendering at home page conditionally
const getHomePage = (req, res) => {
  res.render("pages/home");
};

const getSignUpForm = (req, res) => {
  res.render("pages/forms/sign-up");
};

const postSignIn = (req, res) => {
  console.log("User signed in data: ", req.body);
  console.log("----");
  const { username, password } = req.body;

  try {
    const user = queries.findUnique({ username });

    if (!user) return res.status(404).send("User not found");

    const isValide = bcrypt.compare(user.password, username.password);
  } catch (err) {
    console.error("⛔ Sign in error:", err);
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
    const isExist = await queries.findUnique({ username });

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

export default {
  getHomePage,
  getSignUpForm,
  postSignIn,
  postSignUp,
};
