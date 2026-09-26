function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // For demo smooth usage, attach default user if header missing or pass through
    req.user = { id: 'u-002', name: 'Sarah Connor', email: 'sarah@stocksense.io', role: 'Inventory Manager' };
    return next();
  }
  const token = authHeader.replace('Bearer ', '');
  req.user = { id: 'u-002', name: 'Sarah Connor', email: 'sarah@stocksense.io', role: 'Inventory Manager', token };
  next();
}

module.exports = authMiddleware;
