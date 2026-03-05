import * as shareholderService from "../services/shareholderService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllShareholders = asyncHandler(async (req, res) => {
  const { sortBy = "company_name", sortOrder = "asc" } = req.query;
  const shareholders = await shareholderService.getAllShareholders(sortBy, sortOrder);

  res.status(200).json({
    success: true,
    data: shareholders,
  });
});

export const addShareholder = asyncHandler(async (req, res) => {
  const { firstName, lastName, nationality, companyId } = req.body;

  const shareholder = await shareholderService.addShareholder({
    firstName,
    lastName,
    nationality,
    companyId: parseInt(companyId),
  });

  res.status(201).json({
    success: true,
    data: shareholder,
  });
});

// export const getShareholderById = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const shareholder = await shareholderService.getShareholderById(id);

//   if (!shareholder) {
//     return res.status(404).json({
//       success: false,
//       error: "Shareholder not found",
//     });
//   }

//   res.status(200).json({
//     success: true,
//     data: shareholder,
//   });
// });

// export const getShareholdersByCompanyId = asyncHandler(async (req, res) => {
//   const { companyId } = req.params;

//   const shareholders = await shareholderService.getShareholdersByCompanyId(companyId);

//   res.status(200).json({
//     success: true,
//     data: shareholders,
//   });
// });

export const updateShareholder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, nationality } = req.body;

  const shareholder = await shareholderService.updateShareholder(id, {
    firstName,
    lastName,
    nationality,
  });

  if (!shareholder) {
    return res.status(404).json({
      success: false,
      error: "Shareholder not found",
    });
  }

  res.status(200).json({
    success: true,
    data: shareholder,
  });
});

export const deleteShareholder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const shareholder = await shareholderService.deleteShareholder(id);

  if (!shareholder) {
    return res.status(404).json({
      success: false,
      error: "Shareholder not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Shareholder deleted successfully",
    data: shareholder,
  });
});
