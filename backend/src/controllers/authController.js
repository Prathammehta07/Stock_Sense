const AuthService = require('../services/authService');

class AuthController {
  static login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = AuthService.login(email, password);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static signup(req, res, next) {
    try {
      const result = AuthService.signup(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = AuthService.generateOTP(email);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static verifyOTP(req, res, next) {
    try {
      const { email, otp_code, new_password } = req.body;
      const result = AuthService.verifyOTPAndResetPassword(email, otp_code, new_password);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
