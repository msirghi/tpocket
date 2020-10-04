const passwordStrength = require('check-password-strength');

const monthNames: Array<string> = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const getMonthName = (monthNumber: number) => monthNames[monthNumber];

export const validateEmailStr = (email: string) => {
  return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

export const isPasswordWeak = (password: string): boolean => {
  return passwordStrength(password).value === 'Weak';
};
