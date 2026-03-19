import express from "express";
import cors from "cors";

// import restaurantRoutes from "./routes/restaurantRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// app.use("/restaurants", restaurantRoutes);
// app.use("/orders", orderRoutes);

export default app;