import { pool } from "../db/index.js";

export const createBooking = async (req, res) => {
  const { carName, days, rentPerDay } = req.body;

  if (!carName || !days || !rentPerDay) {
    return res.status(400).json({
      success: false,
      error: "Invalid inputs",
    });
  }
  if (days > 365 || rentPerDay > 2000) {
    return res.status(400).json({
      success: false,
      error: "Invalid inputs",
    });
  }

  const userId = req.user.userId;
  const totalCost = days * rentPerDay;

  try {
    const result = await pool.query(
      `INSERT INTO bookings (user_id, car_name, days, rent_per_day, status)
             VALUES ($1, $2, $3, $4, 'booked')
             RETURNING id`,
      [userId, carName, days, rentPerDay],
    );

    return res.status(201).json({
      success: true,
      data: {
        message: "Booking created successfully",
        bookingId: result.rows[0].id,
        totalCost,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "server error",
    });
  }
};
