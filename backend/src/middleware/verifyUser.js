import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export const verifyUser = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Token Required" });
  }

  jwt.verify(token, config.secretKeys.accessTokenSecret, (err, _) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or Expired Token" });
    }
    next();
  });
};
