import { Router } from "express";

export const routes = Router();

routes.get("/health", (req, res) => {
  return res.json({ status: "ok" });
});
