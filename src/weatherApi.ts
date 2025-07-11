const API_KEY = "e22177d7f536e9cf5c6d11e7ce44723f";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// Обёртка для проверки
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

export const getCoordinatesByCity = async (city: string) => {
  const API_KEY = "e22177d7f536e9cf5c6d11e7ce44723f";
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Геокодинг не удался");
  }

  const data = await response.json();

  if (!data || data.length === 0) {
    throw new Error("Город не найден");
  }

  return {
    lat: data[0].lat,
    lon: data[0].lon,
    name: data[0].name,
    country: data[0].country,
  };
};