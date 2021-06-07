import { Router } from "express";
import { computeRouter } from "./compute.routes";

export const routes = Router();

routes.use("/compute", computeRouter);
