import express from "express";
import * as shareholderController from "../controllers/shareholderController.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/", verifyUser, shareholderController.getAllShareholders);
router.post("/", verifyUser, shareholderController.addShareholder);
router.put("/:id", verifyUser, shareholderController.updateShareholder);
router.delete("/:id", verifyUser, shareholderController.deleteShareholder);

export default router;
