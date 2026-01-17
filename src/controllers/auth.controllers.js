import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
export const login = async (req, res) => {
  const { username, password } = req.body;

  //validate inputs
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "invalid inputs",
    });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "user does not exist",
      });
    }
    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "incorrect password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
    );
    return res.status(200).json({
      success: true,
      data: {
        message: "Login successful",
        token,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: "server error",
    });
  }
};
