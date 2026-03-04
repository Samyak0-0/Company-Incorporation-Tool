import express from "express";
import * as shareholderController from "../controllers/shareholderController.js";

const router = express.Router();

router.get("/", shareholderController.getAllShareholders);
router.post("/", shareholderController.addShareholder);
router.put("/:id", shareholderController.updateShareholder);
router.delete("/:id", shareholderController.deleteShareholder);

export default router;
