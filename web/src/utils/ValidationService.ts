const passwordStrength = require('check-password-strength');

export const validateEmailStr = (email: string) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const isPasswordWeak = (password: string): boolean => {
  return passwordStrength(password).value === 'Weak';
};

export default {
  isPasswordWeak,
  validateEmailStr
};
