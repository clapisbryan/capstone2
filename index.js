const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");


// Import routes
const userRoutes = require("./routes/user.js");

const productRoutes = require("./routes/product");

const cartRoutes = require("./routes/cart");

const orderRoutes = require("./routes/order");

const app = express();

require("dotenv").config();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["http://localhost:8000", "http://127.0.0.1:5500", "http://localhost:5173"],
  // Allow only the specified HTTP methods
  methods: ["GET", "POST"],
  // Allow only the specified headers
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas")
);

// [SECTION] Add your routes here
app.use("/b6/users", userRoutes);
app.use("/b6/products", productRoutes);
app.use("/b6/cart", cartRoutes);
app.use("/b6/orders", orderRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server was connected: ${process.env.PORT}`);
});