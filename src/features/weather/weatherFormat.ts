import { getWeekday, getDayMonth } from "../../utils/formatDate";

export const formatMainWeatherDate = (dt: number, timezone: number): string => {
  const nowUtc = Date.now() + new Date().getTimezoneOffset() * 60000;
  const cityTime = new Date(nowUtc + timezone * 1000);
  const weekday = getWeekday(cityTime);
  const dayMonth = getDayMonth(cityTime);

  const time = cityTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return `${time} • ${capitalize(weekday)} • ${dayMonth}`;
};
