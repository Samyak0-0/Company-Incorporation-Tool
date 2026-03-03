import { Pool } from "pg";
import { config } from "../config/env.js";

let pool;

const createDBPool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: "postgres",
  user: config.db.user,
  password: config.db.password,
});

const initDB = async () => {
  try {
    const result = await createDBPool.query(
      `SELECT datname FROM pg_database WHERE datname = $1`,
      [config.db.name],
    );

    if (result.rowCount === 0) {
      await createDBPool.query(`CREATE DATABASE ${config.db.name}`);
      console.log(`Database "${config.db.name}" created successfully`);
    } else {
      console.log(`Database "${config.db.name}" already exists`);
    }

    await createDBPool.end();

    pool = new Pool({
      host: config.db.host,
      port: config.db.port,
      database: config.db.name,
      user: config.db.user,
      password: config.db.password,
    });

    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      process.exit(1);
    });
  } catch (err) {
    console.error("Database initialization error:", err);
    process.exit(1);
  }
};

export { initDB };

export const query = (text, params) => pool.query(text, params);

export default pool;
