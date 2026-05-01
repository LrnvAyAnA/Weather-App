export const getWeekday = (date: Date): string => {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
  });
};

export const getDayMonth = (date: Date): string => {
  const day = date.getDate();

  const month = date.toLocaleDateString("en-GB", {
    month: "short",
  });

  return `${day} ${month}`;
};