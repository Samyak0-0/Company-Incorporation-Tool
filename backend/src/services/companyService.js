import { query } from "../db/connection.js";
import * as shareholderService from "./shareholderService.js";

export const createCompany = async (companyData) => {
  const { name, capital, holders } = companyData;
  
  // Create the company with no_of_holders = 0 initially
  // It will be incremented as shareholders are added
  const result = await query(
    "INSERT INTO company (name, no_of_holders, capital) VALUES ($1, $2, $3) RETURNING *",
    [name, 0, capital],
  );
  
  const company = result.rows[0];
  
  // Add shareholders if provided
  let shareholders = [];
  if (holders && Array.isArray(holders) && holders.length > 0) {
    shareholders = await shareholderService.addMultipleShareholders(
      holders,
      company.id,
    );
  }
  
  return {
    ...company,
    shareholders,
  };
};

export const getCompanyById = async (id) => {
  const result = await query("SELECT * FROM company WHERE id = $1", [id]);
  const company = result.rows[0];
  
  if (company) {
    const shareholders = await shareholderService.getShareholdersByCompanyId(id);
    return {
      ...company,
      shareholders,
    };
  }
  
  return company;
};

export const getAllCompanies = async (includeShareholders = false) => {
  const result = await query("SELECT * FROM company ORDER BY created_at DESC");
  const companies = result.rows;
  
  if (includeShareholders) {
    const companiesWithShareholders = await Promise.all(
      companies.map(async (company) => {
        const shareholders = await shareholderService.getShareholdersByCompanyId(company.id);
        return {
          ...company,
          shareholders,
        };
      }),
    );
    return companiesWithShareholders;
  }
  
  return companies;
};

export const updateCompany = async (id, companyData) => {
  const { name, no_of_holders, capital, holders } = companyData;
  
  const result = await query(
    "UPDATE company SET name = $1, no_of_holders = $2, capital = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
    [name, no_of_holders, capital, id],
  );
  
  const company = result.rows[0];
  
  let shareholders = [];
  if (holders && Array.isArray(holders)) {
    await query("DELETE FROM shareholders WHERE company_id = $1", [id]);
    
    if (holders.length > 0) {
      shareholders = await shareholderService.addMultipleShareholders(
        holders,
        id,
        false,
      );
    }
  } else {
    shareholders = await shareholderService.getShareholdersByCompanyId(id);
  }
  
  return {
    ...company,
    shareholders,
  };
};

export const deleteCompany = async (id) => {
  const result = await query("DELETE FROM company WHERE id = $1 RETURNING *", [
    id,
  ]);
  return result.rows[0];
};
