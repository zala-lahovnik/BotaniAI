const admin = require("firebase-admin");

const serviceAccount = require(`../${process.env.SERVICE_ACCOUNT}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.query.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    req.userId = userId;

    next();
  } catch (error) {
    console.error('Error validating token:', error);
    return res.status(403).json({ message: error.errorInfo });
  }
};

module.exports = authMiddleware;