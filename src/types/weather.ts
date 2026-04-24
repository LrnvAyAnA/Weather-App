export type ForecastItem = {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
  };
};

export type ForecastCity = {
  name: string;
  country: string;
  timezone: number;
};

export type ForecastData = {
  city: ForecastCity;
  list: ForecastItem[];
};