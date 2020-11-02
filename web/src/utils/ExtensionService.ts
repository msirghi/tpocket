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
  'December'
];

const getMonthName = (monthNumber: number) => monthNames[monthNumber];

export default {
  getMonthName
};
