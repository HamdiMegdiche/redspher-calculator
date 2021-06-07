import express, { Application } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { routes } from "./routes";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app: Application = express();
const FRONT_URL = process.env.FRONT_URL || "http://localhost:4000";

// Allow front to access API
const options: cors.CorsOptions = {
  origin: FRONT_URL
};
app.use(cors(options));

// Secure app by setting various HTTP headers, which mitigate common attack vectors
app.use(helmet());

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use api routes
app.use("/api", routes);

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error) {
  console.error(`Error occurred: ${error.message}`);
}
