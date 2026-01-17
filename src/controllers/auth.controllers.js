import bcrypt from "bcrypt";
import { pool } from "../db/index.js";
export const signup = async (req, res) => {
  const { username, password } = req.body;

  //validate
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Invalid inputs",
    });
  }
  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE username=$1",
      [username],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: "username already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //insert into db
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [username, hashedPassword],
    );

    return res.status(201).json({
      success: true,
      data: {
        message: "User created successfully",
        userId: result.rows[0].id,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "something went wrong",
    });
  }
};
