import { Request, Response, Router } from "express";
import { checkExpressionToCompute, computeExpression } from "../helpers";

export const computeRouter = Router();

computeRouter.post("/", async (req: Request, res: Response): Promise<Response> => {
  const expression = req.body["expression"] ?? "";
  if (!expression?.length) return res.status(400).json({ error: "Cannot compute empty value" });
  if (!checkExpressionToCompute(expression))
    return res.status(400).json({ error: "Cannot parse given expression" });

  try {
    const result = computeExpression(expression);
    return res.json({ computed: result });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error });
  }
});
