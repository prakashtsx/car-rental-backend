import express from "express";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);

export default app;
