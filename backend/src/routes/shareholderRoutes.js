import express from "express";
import * as shareholderController from "../controllers/shareholderController.js";

const router = express.Router();

router.post("/:compnayId", shareholderController.insertShareholders);

export default router;
