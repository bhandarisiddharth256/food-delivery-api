import pool from "../config/db.js";

// GET all restaurants
export const getRestaurants = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM restaurants");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching restaurants");
  }
};

// GET menu by restaurant
export const getMenuByRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM menu_items WHERE restaurant_id = $1",
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching menu");
  }
};
