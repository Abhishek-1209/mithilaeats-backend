const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8081;

// CORS configuration for your custom domain
app.use(cors({
  origin: ['https://mithilaeats.com', 'https://www.mithilaeats.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('✅ MySQL Connection Pool Created');

// Root route
app.get("/", (req, res) => {
  return res.json("🚀 MithilaEats backend is running!");
});

// Checkout API
app.post("/checkout", async (req, res) => {
  const { name, address, pincode, mobile, paymentMethod, totalAmount } = req.body;

  if (!name || !address || !pincode || !mobile || !paymentMethod || !totalAmount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO orders (name, address, pincode, mobile, payment_method, total_amount) VALUES (?, ?, ?, ?, ?, ?)",
      [name, address, pincode, mobile, paymentMethod, totalAmount]
    );

    return res.status(201).json({ message: "Order placed", orderId: result.insertId });
  } catch (error) {
    console.error("❌ Error saving order to database:", error);
    res.status(500).json({ message: "Database error", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
