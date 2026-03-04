import { query } from "./connection.js";

export const initTables = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS company (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        no_of_holders INTEGER NOT NULL,
        capital FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Company table created successfully");

    await query(`
      CREATE TABLE IF NOT EXISTS shareholders (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        nationality VARCHAR(2) NOT NULL,
        company_id INTEGER NOT NULL,
        CONSTRAINT fk_shareholder_company
        FOREIGN KEY (company_id)
        REFERENCES company(id)
        ON DELETE CASCADE
      );
    `);
    console.log("Shareholders table created successfully");

    // await query(`
    //   CREATE TABLE IF NOT EXISTS logs (
    //     id SERIAL PRIMARY KEY,
    //     message VARCHAR(255) NOT NULL,
    //     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     company_id INTEGER NOT NULL,
    //     CONSTRAINT fkey_log_company
    //     FOREIGN KEY (company_id)
    //     REFERENCES company(id)
    //     ON DELETE CASCADE
    //   );
    // `);
    // console.log("Logs table created successfully");

    // await pool.query(`
    //   CREATE TABLE IF NOT EXISTS users (
    //     id SERIAL PRIMARY KEY,
    //     message VARCHAR(255) NOT NULL,
    //     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //   );
    // `);
    // console.log("Users table created successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};
