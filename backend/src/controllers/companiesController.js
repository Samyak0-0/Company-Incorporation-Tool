import * as companyService from "../services/companyService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCompany = asyncHandler(async (req, res) => {
  const { name, email, registrationNumber } = req.body;

  if (!name || !email || !registrationNumber) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: name, email, registrationNumber",
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format",
    });
  }

  const company = await companyService.createCompany({
    name,
    email,
    registrationNumber,
  });

  res.status(201).json({
    success: true,
    data: company,
  });
});

export const getCompanyById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const company = await companyService.getCompanyById(id);

  if (!company) {
    return res.status(404).json({
      success: false,
      error: "Company not found",
    });
  }

  res.status(200).json({
    success: true,
    data: company,
  });
});

export const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await companyService.getAllCompanies();

  res.status(200).json({
    success: true,
    data: companies,
  });
});

export const updateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, registrationNumber } = req.body;

  const company = await companyService.updateCompany(id, {
    name,
    email,
    registrationNumber,
  });

  if (!company) {
    return res.status(404).json({
      success: false,
      error: "Company not found",
    });
  }

  res.status(200).json({
    success: true,
    data: company,
  });
});

export const deleteCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const company = await companyService.deleteCompany(id);

  if (!company) {
    return res.status(404).json({
      success: false,
      error: "Company not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Company deleted successfully",
    data: company,
  });
});
