import express from "express";
import companyRoutes from "./companyRoutes.js";
import authRoutes from "./authRoutes.js";
import logsRoutes from "./logsRoutes.js";
import shareholderRoutes from "./shareholderRoutes.js";

const router = express.Router();

router.use("/company", companyRoutes);
router.use("/shareholders", shareholderRoutes);
router.use("/logs", logsRoutes);
router.use("/auth", authRoutes);

export default router;
