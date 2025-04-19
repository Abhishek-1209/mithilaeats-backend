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

// Async function to initialize database and routes
async function init() {
  try {
    // Create MySQL connection
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
    });

    console.log('✅ Connected to MySQL Database');

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
        const [result] = await db.execute(
          "INSERT INTO orders (name, address, pincode, mobile, payment_method, total_amount) VALUES (?, ?, ?, ?, ?, ?)",
          [name, address, pincode, mobile, paymentMethod, totalAmount]
        );

        return res.status(201).json({ message: "Order placed", orderId: result.insertId });
      } catch (error) {
        console.error("Error saving order to database:", error);
        res.status(500).json({ message: "Database error", error: error.message });
      }
    });

    // Start the server after DB connects
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to connect to MySQL Database:", err);
  }
}

// Call the init function
init();
