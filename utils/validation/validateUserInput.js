import { body, validationResult } from "express-validator"

export const validateUserInput = ({ username, password }) => {
  if (!username || !password) return false;
  if (username.length < 3) return false;
  if (password.length < 6) return false;
  return true;
};