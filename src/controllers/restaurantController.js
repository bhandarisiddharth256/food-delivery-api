import pool from "../config/db.js";

// GET all restaurants
export const getRestaurants = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM restaurants");

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching restaurants",
    });
  }
};

// GET menu by restaurant
export const getMenuByRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, name, price, category FROM menu_items WHERE restaurant_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No menu items found",
      });
    }

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching menu",
    });
  }
};
