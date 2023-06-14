const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

      if (err) {
        console.log(err)
        return res.sendStatus(403);
      } 

      req.userId = user;

      next()
    });
  } catch(error) {
    console.error('Error validating token:', error);
    return res.status(403).json({ message: error.errorInfo });
  }
  
}

module.exports = authenticateToken
