import app from "./app.js";
import dotenv from "dotenv";
import pool from "./config/db.js";
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(3000, async () => {
  console.log("Server started 🚀");

  try {
    await pool.query("SELECT 1");
    console.log("Database connected successfully ✅");
  } catch (err) {
    console.log("Database connection failed ❌", err.message);
  }
});