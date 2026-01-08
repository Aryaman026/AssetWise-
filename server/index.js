const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// DB connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
}).promise(); // Use promise-based pool for async/await

// Test DB connection
db.getConnection()
  .then(connection => {
    console.log('✅ Connected to MySQL!');
    connection.release();
  })
  .catch(err => {
    console.error('DB Connection failed:', err);
  });

// --- Authentication Middleware ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

// --- Routes ---
app.get('/', (req, res) => res.send('Backend is running!'));

// --- Auth Routes ---

// Register
app.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Check if user exists
    const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    res.json({ message: 'User registered!', id: result.insertId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Check password
    if (await bcrypt.compare(password, user.password)) {
      // Create JWT
      const accessToken = jwt.sign(
        { id: user.id, username: user.username }, 
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // Token expires in 1 day
      );
      res.json({ accessToken });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Asset Routes (Now Protected and User-Specific) ---

// Get all assets for the logged-in user
app.get('/assets', verifyToken, async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM assets WHERE user_id = ?', [req.user.id]);
    res.json(results);
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Add asset for the logged-in user
app.post('/assets', verifyToken, async (req, res) => {
  const { name, purchase_date, cost, description, service_date, warranty_expiry, expenses } = req.body;
  const userId = req.user.id;
  try {
    const [result] = await db.query(
      'INSERT INTO assets (name, purchase_date, cost, description, service_date, warranty_expiry, expenses, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, purchase_date, cost, description, service_date, warranty_expiry, expenses, userId]
    );
    res.json({ message: 'Asset added!', id: result.insertId });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Update asset for the logged-in user
app.put('/assets/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, purchase_date, cost, description, service_date, warranty_expiry, expenses } = req.body;
  const userId = req.user.id;
  try {
    const [result] = await db.query(
      'UPDATE assets SET name=?, purchase_date=?, cost=?, description=?, service_date=?, warranty_expiry=?, expenses=? WHERE id=? AND user_id=?',
      [name, purchase_date, cost, description, service_date, warranty_expiry, expenses, id, userId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Asset not found or user not authorized' });
    }
    res.json({ message: 'Asset updated!' });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Delete asset for the logged-in user
app.delete('/assets/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const [result] = await db.query('DELETE FROM assets WHERE id=? AND user_id=?', [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Asset not found or user not authorized' });
    }
    res.json({ message: 'Asset deleted!' });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// --- NEW Notification Route ---
app.get('/notifications', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const daysInAdvance = 30; // Get alerts for items due in the next 30 days
  
  try {
    const [upcoming] = await db.query(
      `SELECT id, name, 'warranty' as type, warranty_expiry as date FROM assets 
       WHERE user_id = ? AND warranty_expiry BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
       UNION
       SELECT id, name, 'service' as type, service_date as date FROM assets
       WHERE user_id = ? AND service_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
       ORDER BY date ASC`,
      [userId, daysInAdvance, userId, daysInAdvance]
    );
    res.json(upcoming);
  } catch (err) {
    res.json({ error: err.message });
  }
});


// Start server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));