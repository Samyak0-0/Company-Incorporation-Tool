import * as companyService from "../services/companyService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCompany = asyncHandler(async (req, res) => {
  const { name, noOfHolders, capital, holders } = req.body;

  const company = await companyService.createCompany({
    name,
    noOfHolders,
    capital,
    holders,
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
  const { page, filers } = req.params;
  const { data = "compact", sortBy = "created_at", sortOrder = "desc" } = req.query;
  const includeShareholders = data === "full";
  const companies = await companyService.getAllCompanies(
    includeShareholders,
    sortBy,
    sortOrder,
  );

  res.status(200).json({
    success: true,
    data: companies,
  });
});

export const updateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, noOfHolders, capital, holders } = req.body;

  const company = await companyService.updateCompany(id, {
    name,
    no_of_holders: noOfHolders,
    capital,
    holders,
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
