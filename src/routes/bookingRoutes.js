import express from "express";
import { authMiddleware } from "../middlewares/authMiddlewares.js";
import { createBooking } from "../controllers/booking.controllers.js";

const router = express.Router();

// all booking routes are protected
router.use(authMiddleware);

router.post("/", createBooking);

export default router;
