import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const app: Application = express();
const port = process.env.PORT ?? 4001;

// Allow front to access api.
const options: cors.CorsOptions = {
  origin: ["http://localhost:4000"],
};
app.use(cors(options));

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  "/api/compute",
  async (req: Request, res: Response): Promise<Response> => {
    const text = req.body["text"] ?? "";
    if (!text?.length)
      return res.status(400).send({ error: "Cannot parse value" });
    console.log("text :", text);

    const result = eval(text);
    console.log("result :", result);

    return res.status(200).send(result?.toString());
  }
);

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error) {
  console.error(`Error occured: ${error.message}`);
}
