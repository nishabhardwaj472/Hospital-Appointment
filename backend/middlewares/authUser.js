import jwt from 'jsonwebtoken'

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: 'Not Authorized. Please log in again.' });
    }

    // Decode the token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user ID to req object (not to req.body)
    req.userId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
