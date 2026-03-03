import { query } from "../db/connection.js";

export const createCompany = async (companyData) => {
  const { name, no_of_holders, capital } = companyData;
  const result = await query(
    "INSERT INTO company (name, no_of_holders, capital) VALUES ($1, $2, $3) RETURNING *",
    [name, no_of_holders, capital],
  );
  return result.rows[0];
};

export const getCompanyById = async (id) => {
  const result = await query("SELECT * FROM company WHERE id = $1", [id]);
  return result.rows[0];
};

export const getAllCompanies = async () => {
  const result = await query("SELECT * FROM company ORDER BY created_at DESC");
  return result.rows;
};

export const updateCompany = async (id, companyData) => {
  const { name, no_of_holders, capital } = companyData;
  const result = await query(
    "UPDATE company SET name = $1, no_of_holders = $2, capital = $3 WHERE id = $4 RETURNING *",
    [name, no_of_holders, capital, id],
  );
  return result.rows[0];
};

export const deleteCompany = async (id) => {
  const result = await query("DELETE FROM company WHERE id = $1 RETURNING *", [
    id,
  ]);
  return result.rows[0];
};
