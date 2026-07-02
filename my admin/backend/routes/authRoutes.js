const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    delete user.password;
    return res.json({ success: true, message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});
router.post('/register', async (req, res) => {
  const { fullName, username, email, phone, gender, dob, password } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (full_name, username, email, phone, gender, dob, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [fullName, username || '', email, phone || '', gender || '', dob || null, hashedPassword, 'User']
    );
    
    const user = {
      id: result.insertId,
      fullName,
      email,
      phone,
      username,
    };
    return res.status(201).json({ success: true, message: 'Registration successful', user });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

module.exports = router;

