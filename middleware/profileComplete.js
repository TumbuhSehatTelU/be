const { isProfileComplete } = require('../utils/profileCheck');

module.exports = (req, res, next) => {
  const user = req.user;
  if (!isProfileComplete(user)) {
    return res.status(403).json({ message: 'Lengkapi data diri terlebih dahulu' });
  }
  next();
};
