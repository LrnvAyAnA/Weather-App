import { getWeekday, getDayMonth } from "../../utils/formatDate";

export const formatMainWeatherDate = (dt: number): string => {
  const weekday = getWeekday(dt);
  const dayMonth = getDayMonth(dt);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return `${capitalize(weekday)}, ${dayMonth}`;
};