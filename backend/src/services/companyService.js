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
    const shareholders =
      await shareholderService.getShareholdersByCompanyId(id);
    return {
      ...company,
      shareholders,
    };
  }

  return company;
};

export const getAllCompanies = async (
  includeShareholders = false,
  sortBy = "created_at",
  sortOrder = "desc",
  pageNo,
) => {
  // Validate sortBy to prevent SQL injection
  const validColumns = ["id", "name", "no_of_holders", "capital", "created_at"];
  const column = validColumns.includes(sortBy) ? sortBy : "created_at";
  const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const result = await query(
    `SELECT * FROM company ORDER BY ${column} ${order} LIMIT 5 OFFSET ${(pageNo - 1) * 5}`,
  );
  const companies = result.rows;

  const noOfCompaniesQuery = await query(`SELECT COUNT(*) FROM company`);
  const noOfCompanies = noOfCompaniesQuery.rows[0].count;

  if (includeShareholders) {
    const companiesWithShareholders = await Promise.all(
      companies.map(async (company) => {
        const shareholders =
          await shareholderService.getShareholdersByCompanyId(company.id);
        return {
          ...company,
          shareholders,
        };
      }),
    );
    return companiesWithShareholders;
  }

  return {
    companies,
    noOfCompanies,
  };
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

export const insertDummyData = async () => {
  await query("DELETE FROM shareholders");
  await query("DELETE FROM company");

  const data = [
    {
      name: "TechVentures Inc.",
      capital: 5000000,
      holders: [
        { firstName: "Alice", lastName: "Johnson", nationality: "US" },
        { firstName: "Bob", lastName: "Smith", nationality: "GB" },
        { firstName: "Chen", lastName: "Wei", nationality: "CN" },
      ],
    },
    {
      name: "H & H Motors",
      capital: 2999999,
      holders: [
        { firstName: "Adam", lastName: "Sjufans", nationality: "CO" },
        { firstName: "Salem", lastName: "Steven", nationality: "NP" },
      ],
    },
    {
      name: "Green Energy Ltd.",
      capital: 2500000,
      holders: [
        { firstName: "Maria", lastName: "Garcia", nationality: "ES" },
        { firstName: "James", lastName: "Pat", nationality: "IN" },
      ],
    },
    {
      name: "Nordic Logistics",
      capital: 1505050,
      holders: [
        { firstName: "Erik", lastName: "Larsen", nationality: "NO" },
        { firstName: "Sofia", lastName: "Berg", nationality: "SE" },
        { firstName: "Mikkel", lastName: "Hansen", nationality: "NP" },
        { firstName: "Laura", lastName: "Makinen", nationality: "FI" },
      ],
    },
    {
      name: "Samuel Phones & Tech",
      capital: 1200000,
      holders: [
        { firstName: "Dembele", lastName: "Lan", nationality: "NP" },
        { firstName: "Palav", lastName: "Hasan", nationality: "PG" },
        { firstName: "Suerek", lastName: "Hamo", nationality: "ID" },
        { firstName: "Ling", lastName: "Ging", nationality: "CN" },
      ],
    },
    {
      name: "Molotov Plantations",
      capital: 9999999,
      holders: [
        { firstName: "Sing", lastName: "Sumi", nationality: "IE" },
        { firstName: "Bakan", lastName: "Philly", nationality: "IT" },
        { firstName: "Soy", lastName: "Derke", nationality: "KR" },
        { firstName: "Tai", lastName: "Boaster", nationality: "KG" },
        { firstName: "Primmie", lastName: "Thy", nationality: "JP" },
      ],
    },
  ];

  const results = [];
  for (const companyData of data) {
    const company = await createCompany(companyData);
    results.push(company);
  }

  return results.length === data.length;
};
