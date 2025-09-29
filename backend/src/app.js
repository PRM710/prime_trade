import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Swagger docs
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
