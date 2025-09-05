export interface DailyForecast {
  date: string;
  min: number;
  max: number;
  icon: string;
}

export const transformForecastData = (forecastData: any): DailyForecast[] => {
  if (!forecastData?.list) return [];
//  console.log("Исходный массив forecastData.list:", forecastData.list);
  const grouped: Record<string, { min: number; max: number; icon: string }> = {};

  forecastData.list.forEach((item: any) => {
    const date = item.dt_txt.split(" ")[0];
    const temp = item.main.temp;

    if (!grouped[date]) {
      grouped[date] = {
        min: temp,
        max: temp,
        icon: item.weather[0].icon,
      };
    } else {
      grouped[date].min = Math.min(grouped[date].min, temp);
      grouped[date].max = Math.max(grouped[date].max, temp);
    }
  });

  console.log("После группировки по дате:", grouped);

  return Object.entries(grouped).map(([date, { min, max, icon }]) => ({
    date,
    min: Math.round(min),
    max: Math.round(max),
    icon,
  }));
};