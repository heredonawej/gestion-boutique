const jwt = require("jsonwebtoken");

function verifierToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token manquant.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const utilisateur = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.utilisateur = utilisateur;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token invalide.",
    });
  }
}

module.exports = verifierToken;