function verifierAdmin(req, res, next) {
  if (req.utilisateur.role !== "admin") {
    return res.status(403).json({
      message: "Accès refusé."
    });
  }

  next();
}

module.exports = verifierAdmin;