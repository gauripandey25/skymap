const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Secret key
const secretKey = process.env.JWT_SECRET || '89c5ee782e55c915b9d533363626de93248f3eb01c0e37a69b0ae725e009eabc80968f12fd532d9b18e35cb00ded0b35f19fb9cc9888c7df762b3bec56c9afad';

// Generate Token
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            username: user.username
        },
        secretKey,
        { expiresIn: '1h' } // Token expires in 1 hour
    );
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    user = new User({
      username,
      email,
      password, // This password will be hashed by the userModel's pre-save hook
    });

    // Save the user to the database
    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({ token, message: 'Registration successful' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
      const { username, password } = req.body;
      console.log('Login Request:', req.body);

      const user = await User.findOne({ username });
      if (!user) {
          console.log('No user found with username:', username);
          return res.status(400).json({ success: false, message: 'Invalid username' });
      }

      // Debugging: Log the user object and the stored hashed password
      console.log('User Object:', user);
      console.log('Password Hash:', user.password);

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
          console.log('Password mismatch for username:', username);
          return res.status(400).json({ success: false, message: 'Invalid username or password' });
      }

      const token = generateToken(user);
      res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
};
