const User = require('../models/User');

class AuthService {
  static login(email, password) {
    const user = User.findByEmail(email);
    if (!user) {
      throw new Error('User not found with this email');
    }
    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }

    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }

  static signup(data) {
    const existing = User.findByEmail(data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }
    const newUser = User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'Inventory Manager'
    });
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    const { password: _, ...userWithoutPassword } = newUser;
    return { token, user: userWithoutPassword };
  }

  static generateOTP(email) {
    const user = User.findByEmail(email);
    if (!user) {
      throw new Error('No user found with provided email address');
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    User.setOTP(email, otpCode);
    return { message: 'OTP sent to email', otp_code: otpCode };
  }

  static verifyOTPAndResetPassword(email, otpCode, newPassword) {
    const user = User.findByEmail(email);
    if (!user || user.otp_code !== otpCode) {
      throw new Error('Invalid or expired OTP code');
    }
    User.updatePassword(email, newPassword);
    return { message: 'Password reset successful' };
  }
}

module.exports = AuthService;
