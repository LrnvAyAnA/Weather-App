import { getWeekday } from "../utils/formatDate";

export interface DailyForecast {
  date: string;
  min: number;
  max: number;
  icon: string;
  weekday:string;
  description: string;
}

export const transformForecastData = (forecastData: any): DailyForecast[] => {
  if (!forecastData?.list) return [];

  const grouped: Record<
    string,
    {
      min: number;
      max: number;
      icon: string;
      descriptions: string[];
    }
  > = {};

  forecastData.list.forEach((item: any) => {
    const date = item.dt_txt.split(" ")[0];
    const temp = item.main.temp;

    const description = item.weather?.[0]?.description ?? "";

    if (!grouped[date]) {
      grouped[date] = {
        min: temp,
        max: temp,
        icon: item.weather[0].icon,
        descriptions: [description],
      };
    } else {
      grouped[date].min = Math.min(grouped[date].min, temp);
      grouped[date].max = Math.max(grouped[date].max, temp);
      grouped[date].descriptions.push(description);
    }
  });

  return Object.entries(grouped).map(([date, data]) => {
    const weekday = getWeekday(new Date(date));

    const description = data.descriptions[0];

    return {
      date,
      weekday,
      min: Math.round(data.min),
      max: Math.round(data.max),
      icon: data.icon,
      description,
    };
  });
};
