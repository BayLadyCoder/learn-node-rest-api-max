const monthNameByMonthIndex = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

const getMonthName = (date) => {
  if (typeof date !== 'object') {
    date = new Date(date);
  }
  const monthIndex = date.getMonth();
  return monthNameByMonthIndex[monthIndex];
};

const getOrdinalDateSuffix = (date) => {
  if (typeof date !== 'object') {
    date = new Date(date);
  }

  const dateNumber = date.getUTCDate();
  if (dateNumber >= 11 && dateNumber <= 13) {
    return 'th';
  }
  const lastDigit = dateNumber % 10;

  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

exports.createDisplayDateInfo = (date) => {
  if (typeof date !== 'object') {
    date = new Date(date);
  }

  return {
    date,
    datePrefix: date.getUTCDate(),
    dateSuffix: getOrdinalDateSuffix(date),
    month: getMonthName(date),
    year: date.getUTCFullYear(),
  };
};
