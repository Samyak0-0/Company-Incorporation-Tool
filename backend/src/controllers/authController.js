import * as authServices from "../services/authService.js";
import crypto from "crypto";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (await authServices.checkUserByName(username)) {
    return res.status(409).json({ message: `${username} already exists` });
  }

  if (await authServices.checkUserByEmail(email)) {
    return res.status(409).json({ message: `${email} already exists` });
  }

  const hashedPassword = await bycrypt.hash(password, 10);

  const user = await authServices.registerUser({
    username,
    email,
    hashedPassword,
  });

  const refreshToken = jwt.sign(
    { id: user.id },
    config.secretKeys.refreshTokenSecret,
    {
      expiresIn: "7d",
    },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await authServices.createSession({
    userId: user.id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
  const accessToken = jwt.sign(
    { id: user.id, sessionId: session.id },
    config.secretKeys.accessTokenSecret,
    {
      expiresIn: "15m",
    },
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return res.status(201).json({
    message: "User successfully registered",
    accessToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.checkUserByEmail(email, true);

  if (!user) {
    return res.status(409).json({ message: `${email} doesnt exist` });
  }

  const isValid = await bycrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(409).json({ message: `Invalid Credentials.` });
  }

  const refreshToken = jwt.sign(
    { id: user.id },
    config.secretKeys.refreshTokenSecret,
    { expiresIn: "7d" },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await authServices.createSession({
    userId: user.id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = jwt.sign(
    {
      id: user.id,
      sessionId: session.id,
    },
    config.secretKeys.accessTokenSecret,
    { expiresIn: "15m" },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "Logged in successfully.",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token not found",
    });
  }

  const decodedToken = jwt.verify(token, config.secretKeys.accessTokenSecret);

  const user = await authServices.findUserById(decodedToken.id);
  return res.status(200).json({
    message: "User fetched successfully",
    user: {
      username: user.username,
      email: user.email,
      id: user.id,
    },
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    // res.clearCookie("refreshToken");
    return res.status(401).json({
      message: "No Refresh Token Found",
    });
  }

  const decodedToken = jwt.verify(
    refreshToken,
    config.secretKeys.refreshTokenSecret,
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await authServices.getSessionByHash(refreshTokenHash);

  if (!session) {
    // res.clearCookie("refreshToken");
    return res.status(400).json({
      message: "Invalid Refresh Token",
    });
  }

  const user = await authServices.findUserById(decodedToken.id);

  const accessToken = jwt.sign(
    {
      id: decodedToken.id,
      sessionId: session.id,
    },
    config.secretKeys.accessTokenSecret,
    {
      expiresIn: "15m",
    },
  );

  const newRefreshToken = jwt.sign(
    {
      id: decodedToken.id,
    },
    config.secretKeys.refreshTokenSecret,
    {
      expiresIn: "7d",
    },
  );

  const newRefreshTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  await authServices.editSessionHash(session.id, newRefreshTokenHash);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "Access Token Successfully Refreshed",
    accessToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh Token Not Found",
    });
  }

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await authServices.getSessionByHash(refreshTokenHash);
  if (!session) {
    return res.status(400).json({
      message: "Invalid Refresh Token",
    });
  }

  await authServices.updateSessionById(session.id);

  res.clearCookie("refreshToken");

  return res.status(200).json({
    message: "Logged Out Successfully",
  });
});

export const logoutAll = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh Token Not Found",
    });
  }

  const decoded = jwt.verify(
    refreshToken,
    config.secretKeys.refreshTokenSecret,
  );

  await authServices.editUserSessions(decoded.id);

  res.clearCookie("refreshToken");

  return res.status(200).json({
    message: "Logged Out of All Devices",
  });
});
