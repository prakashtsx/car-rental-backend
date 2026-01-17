import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

//create connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then(() => console.log("connected to postgresql successfully !"))
  .catch((err) => console.log("database connection error: ", err));
