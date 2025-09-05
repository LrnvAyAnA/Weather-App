const API_KEY = "e22177d7f536e9cf5c6d11e7ce44723f";
const BASE_URL = "https://api.openweathermap.org";

export const fetchWeatherForecast = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=40&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Ошибка ответа от сервера");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка:", error);
    throw error;
  }
};

export const fetchCurrentWeather = async (lat: number, lon: number) => {
  const url = `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Ошибка получения текущей погоды");
    }

    const data = await response.json();
    console.log("Geo API response:", data);
    return data;
  } catch (error) {
    console.error("Ошибка:", error);
    throw error;
  }
};

export const getCitySuggestions = async (query: string) => {
  const url = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Не удалось получить подсказки");
  }

  const data = await response.json();

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((item: any) => ({
    name: item.name,
    localName: item.local_names?.en || item.name, 
    state: item.state,
    country: item.country,
    lat: item.lat,
    lon: item.lon,
  }));
};

export const getCityByCoords = async (lat: number, lon: number) => {
  const url = `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Не удалось получить город по координатам");
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    return {
      name: data[0].name,
      localName: data[0].local_names?.en || data[0].name,
      country: data[0].country,
      state: data[0].state,
      lat: data[0].lat,
      lon: data[0].lon,
    };
  } catch (err) {
    console.error("Ошибка при обратном геокодинге:", err);
    return null;
  }
};