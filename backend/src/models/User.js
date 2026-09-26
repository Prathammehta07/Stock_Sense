const db = require('../config/database');

class User {
  static findByEmail(email) {
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  static findById(id) {
    return db.users.find(u => u.id === id);
  }

  static create(userData) {
    const newUser = {
      id: `u-${Date.now()}`,
      ...userData,
      created_at: new Date().toISOString()
    };
    db.users.push(newUser);
    return newUser;
  }

  static setOTP(email, otpCode) {
    const user = this.findByEmail(email);
    if (user) {
      user.otp_code = otpCode;
      user.otp_expires_at = Date.now() + 15 * 60 * 1000; // 15 mins
    }
    return user;
  }

  static updatePassword(email, newPassword) {
    const user = this.findByEmail(email);
    if (user) {
      user.password = newPassword;
      delete user.otp_code;
      delete user.otp_expires_at;
    }
    return user;
  }
}

module.exports = User;
