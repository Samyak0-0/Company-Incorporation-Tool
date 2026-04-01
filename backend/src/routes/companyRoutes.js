import express from "express";
import * as companyController from "../controllers/companyController.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("hello world");
// });
router.get("/", verifyUser, companyController.getAllCompanies);
router.get("/:id", verifyUser, companyController.getCompanyById);
router.post("/", companyController.createCompany);

router.put("/:id", verifyUser, companyController.updateCompany);
router.delete("/:id", verifyUser, companyController.deleteCompany);

router.post("/dummy-data", companyController.dummyData);

// router.get("/:companyId", (req, res) => {
//   const companyId = req.params.companyId;
//   res.send(`hello world ${companyId}`);
// });

export default router;
