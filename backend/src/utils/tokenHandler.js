import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  jwt.sign({ name: user.username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  jwt.sign({ name: user.username }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
