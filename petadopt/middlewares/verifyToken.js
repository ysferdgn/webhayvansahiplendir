const jwt = require('jsonwebtoken');

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Token header'ı eksik" });

  // Bearer TOKEN şeklindeyse split() edip alın
  const token = authHeader.split(" ")[1] || authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // middleware sonrası req.user üzerinden erişilir
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token geçersiz" });
  }
}; 