import jwt from 'jsonwebtoken';

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;

    if (!bearerHeader || !bearerHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Login again.' });
    }

    const token = bearerHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ success: false, message: 'Invalid token payload.' });
    }

    next();
  } catch (error) {
    console.error("authAdmin error:", error);
    res.status(401).json({ success: false, message: 'Authorization failed. Please login again.' });
  }
};

export default authAdmin;
