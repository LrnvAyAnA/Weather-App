const API_KEY = "e22177d7f536e9cf5c6d11e7ce44723f";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

export const fetchWeatherForecast = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}forecast?lat=${lat}&lon=${lon}&cnt=40&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Ошибка ответа от сервера");
    }

    const data = await response.json();
    console.log("API работает. Ответ:", data);
    return data;
  } catch (error) {
    console.error("Ошибка:", error);
    throw error;
  }
};

// 💡 Новый метод — автоподсказки по городу
export const getCitySuggestions = async (query: string) => {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;

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
    state: item.state,
    country: item.country,
    lat: item.lat,
    lon: item.lon,
  }));
};
