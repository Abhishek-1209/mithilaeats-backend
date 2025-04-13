const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
//const PORT = 5000;
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Parse JSON request bodies
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Abhishek1209', // <--- Replace this
  database: 'mithilaeats'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL Connection Failed:', err);
  } else {
    console.log('✅ Connected to MySQL Database');
  }
});
app.get("/", (req, res) => {
    return res.json("🚀 MithilaEats backend is running!");
});

// API to handle checkout
app.post('/checkout', (req, res) => {
  const { name, address, pincode, mobile, paymentMethod, totalAmount } = req.body;

  if (!name || !address || !pincode || !mobile || !paymentMethod || !totalAmount) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const sql = 'INSERT INTO orders (name, address, pincode, mobile, payment_method, total_amount) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(sql, [name, address, pincode, mobile, paymentMethod, totalAmount], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      return res.status(500).json({ message: 'Error placing order' });
    }

    res.status(200).json({ message: 'Order placed successfully', orderId: result.insertId });
  });
});