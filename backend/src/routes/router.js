import express from "express";
import companyRoutes from "./companyRoutes.js";
import loginRoutes from "./loginRoutes.js";
import logsRoutes from "./loginRoutes.js";
import shareholderRoutes from "./shareholderRoutes.js";

const router = express.Router();

router.use("/company", companyRoutes);
router.use("/shareholders", shareholderRoutes);
router.use("/logs", logsRoutes);
router.use("/login", loginRoutes);

export default router;
