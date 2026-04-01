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
  const {
    data = "compact",
    sortBy = "created_at",
    sortOrder = "desc",
    pageNo = 1,
  } = req.query;
  const includeShareholders = data === "full";
  const result = await companyService.getAllCompanies(
    includeShareholders,
    sortBy,
    sortOrder,
    pageNo,
  );

  res.status(200).json({
    success: true,
    data: result.companies,
    totalCompanies: result.noOfCompanies,
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

export const dummyData = asyncHandler(async (_, res) => {
  const dummy = await companyService.insertDummyData();

  if (!dummy) {
    return res.status(400).json({
      message: "Failure in Inserting Dummy Data to the Database.",
    });
  }

  return res.status(200).json({
    message: "Successfully Inserted Dummy Data to the Database.",
  });
});
