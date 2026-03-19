import pool from "../config/db.js";

export const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const { user_id, restaurant_id, items, total_amount } = req.body;

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

    res.json({ message: "Order placed", orderId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).send("Order failed");
  } finally {
    client.release();
  }
};
