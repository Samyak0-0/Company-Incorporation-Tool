import { query } from "../db/connection.js";

export const addShareholder = async (
  shareholderData,
  incrementCount = true,
) => {
  const { firstName, lastName, nationality, companyId } = shareholderData;
  const result = await query(
    "INSERT INTO shareholders (first_name, last_name, nationality, company_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [firstName, lastName, nationality, companyId],
  );

  // Increment no_of_holders for the company and update updated_at
  // Only increment if this is a standalone add (not part of an update)
  if (incrementCount) {
    await query(
      "UPDATE company SET no_of_holders = no_of_holders + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [companyId],
    );
  }

  return result.rows[0];
};

export const addMultipleShareholders = async (
  shareholders,
  companyId,
  incrementCount = true,
) => {
  const results = [];
  for (const shareholder of shareholders) {
    const result = await addShareholder(
      {
        ...shareholder,
        companyId,
      },
      incrementCount,
    );
    results.push(result);
  }
  return results;
};

export const getAllShareholders = async () => {
  const result = await query(
    "SELECT s.*, c.name as company_name FROM shareholders s JOIN company c ON s.company_id = c.id",
  );
  return result.rows;
};

export const getShareholdersByCompanyId = async (companyId) => {
  const result = await query(
    "SELECT * FROM shareholders WHERE company_id = $1",
    [companyId],
  );
  return result.rows;
};

export const getShareholderById = async (id) => {
  const result = await query("SELECT * FROM shareholders WHERE id = $1", [id]);
  return result.rows[0];
};

export const updateShareholder = async (id, shareholderData) => {
  const { firstName, lastName, nationality } = shareholderData;

  // Get shareholder to find company_id
  const shareholder = await getShareholderById(id);
  if (!shareholder) {
    return null;
  }

  const result = await query(
    "UPDATE shareholders SET first_name = $1, last_name = $2, nationality = $3 WHERE id = $4 RETURNING *",
    [firstName, lastName, nationality, id],
  );

  // Update company updated_at timestamp
  await query(
    "UPDATE company SET updated_at = CURRENT_TIMESTAMP WHERE id = $1",
    [shareholder.company_id],
  );

  return result.rows[0];
};

export const deleteShareholder = async (id) => {
  // Get the shareholder to find company_id
  const shareholder = await getShareholderById(id);

  if (!shareholder) {
    return null;
  }

  const result = await query(
    "DELETE FROM shareholders WHERE id = $1 RETURNING *",
    [id],
  );

  // Decrement no_of_holders for the company and update updated_at
  await query(
    "UPDATE company SET no_of_holders = no_of_holders - 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
    [shareholder.company_id],
  );

  return result.rows[0];
};
