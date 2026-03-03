import express from "express";
import * as companyController from "../controllers/companyController.js";

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("hello world");
// });
router.get("/", companyController.getAllCompanies);
router.get("/:id", companyController.getCompanyById);
router.post("/", companyController.createCompany);

router.put("/:id", companyController.updateCompany);
router.delete("/:id", companyController.deleteCompany);

// router.get("/:companyId", (req, res) => {
//   const companyId = req.params.companyId;
//   res.send(`hello world ${companyId}`);
// });

export default router;
