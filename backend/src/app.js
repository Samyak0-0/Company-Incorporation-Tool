import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import appRouter from "./routes/index.js";
import { initDB } from "./db/connection.js";
import { initTables } from "./db/initTables.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/api", appRouter);

app.use(errorHandler);

const startServer = async () => {
  try {
    await initDB();
    await initTables();
    app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}
Environment: ${config.nodeEnv}
Database: ${config.db.host}:${config.db.port}/${config.db.name}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

export default app;
