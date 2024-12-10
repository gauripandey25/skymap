const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      // You can add more fields if needed
    },
    JWT_SECRET,
    { expiresIn: '1h' } // Token expires in 1 hour
  );
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract token part from Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No Token Provided!' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded token to request object
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).json({ message: 'Access Denied: Invalid Token!' });
  }
};

module.exports = { generateToken, verifyToken };
