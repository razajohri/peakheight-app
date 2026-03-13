// Utility functions for DailyRoutineScreen

export const generateWeekDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  return dates;
};

export const formatDate = (date) => {
  const day = date.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  return `${day} ${month}`;
};

export const getPlanDescription = (day) => {
  if (day <= 30) {
    return "Building growth hormone habits for height growth";
  } else if (day <= 60) {
    return "Advancing to intensive growth exercises";
  } else if (day <= 90) {
    return "Optimizing your growth potential";
  } else {
    return "Maintaining your growth achievements";
  }
};

export const formatDayLabel = (iso) => {
  const d = new Date(iso);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[d.getMonth()];
  const day = d.getDate();
  return `${month} ${day}`;
};
