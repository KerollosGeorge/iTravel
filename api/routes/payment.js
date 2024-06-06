import express from "express";

import { Pay, Cancel, Success } from "../controllers/payment.js";
const router = express.Router();

router.post("/", Pay);
router.get("/success", Success);
router.get("/cancel", Cancel);

export default router;
