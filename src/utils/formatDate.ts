export const getWeekday = (dt: number): string => {
  const date = new Date(dt * 1000);

  return date.toLocaleDateString("en-EN", {
    weekday: "long",
  });
};

export const getDayMonth = (dt: number): string => {
  const date = new Date(dt * 1000);

  const day = date.getDate();
  const month = date.toLocaleDateString("en-EN", {
    month: "short",
  });

  return `${day} ${month}`;
};