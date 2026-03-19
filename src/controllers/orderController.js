import pool from "../config/db.js";

export const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const { user_id, restaurant_id, items, total_amount } = req.body;

    // ✅ Basic validation
    if (!user_id || !restaurant_id || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
      });
    }

    await client.query("BEGIN");

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, restaurant_id, total_amount)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [user_id, restaurant_id, total_amount]
    );

    const orderId = orderResult.rows[0].id;

    for (let item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.menu_item_id, item.quantity, item.price]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId,
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Order failed",
    });
  } finally {
    client.release();
  }
};

export const getUserOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT o.id, o.total_amount, o.status, r.name AS restaurant_name
       FROM orders o
       JOIN restaurants r ON o.restaurant_id = r.id
       WHERE o.user_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching orders");
  }
};