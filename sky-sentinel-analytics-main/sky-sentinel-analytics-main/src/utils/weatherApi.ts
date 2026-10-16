// Malaysia Weather Station Data and API Utilities

export interface WeatherStation {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [lat, lng]
  accuweatherKey: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  forecast: string;
  lastUpdated: Date;
  station: WeatherStation;
}

// Malaysia Weather Stations
export const MALAYSIA_STATIONS: WeatherStation[] = [
  {
    id: "putrajaya",
    name: "Putrajaya",
    location: "W.P. Putrajaya",
    coordinates: [2.9264, 101.6964],
    accuweatherKey: "235400",
  },
  {
    id: "kl",
    name: "Kuala Lumpur",
    location: "Subang",
    coordinates: [3.1319, 101.5488],
    accuweatherKey: "48647",
  },
  {
    id: "penang",
    name: "Penang",
    location: "Bayan Lepas",
    coordinates: [5.2972, 100.2760],
    accuweatherKey: "229893",
  },
  {
    id: "jb",
    name: "Johor Bahru",
    location: "Senai",
    coordinates: [1.6416, 103.6696],
    accuweatherKey: "228029",
  },
  {
    id: "kuching",
    name: "Kuching",
    location: "Sarawak",
    coordinates: [1.5497, 110.3592],
    accuweatherKey: "230204",
  },
  {
    id: "kk",
    name: "Kota Kinabalu",
    location: "Sabah",
    coordinates: [5.9804, 116.0735],
    accuweatherKey: "229992",
  },
];

// Generate realistic mock data for Malaysia (tropical climate)
export const generateMockWeatherData = (station: WeatherStation): WeatherData => {
  // Tropical Malaysia ranges
  const baseTemp = 28 + Math.random() * 6; // 28-34°C
  const baseHumidity = 65 + Math.random() * 25; // 65-90%
  const baseWind = 5 + Math.random() * 25; // 5-30 km/h
  
  const forecasts = [
    "Partly cloudy with afternoon showers",
    "Scattered thunderstorms expected",
    "Hot and humid conditions",
    "Light rain possible in evening",
    "Clear skies, high UV index",
    "Monsoon winds from northeast",
  ];

  return {
    temperature: Math.round(baseTemp * 10) / 10,
    humidity: Math.round(baseHumidity),
    windSpeed: Math.round(baseWind * 10) / 10,
    forecast: forecasts[Math.floor(Math.random() * forecasts.length)],
    lastUpdated: new Date(),
    station,
  };
};

// AccuWeather API fetch (with mock fallback)
export const fetchWeatherData = async (
  station: WeatherStation,
  apiKey?: string
): Promise<WeatherData> => {
  // If no API key, return mock data
  if (!apiKey) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    return generateMockWeatherData(station);
  }

  try {
    const response = await fetch(
      `https://dataservice.accuweather.com/currentconditions/v1/${station.accuweatherKey}?apikey=${apiKey}&details=true`
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    
    return {
      temperature: data[0].Temperature.Metric.Value,
      humidity: data[0].RelativeHumidity,
      windSpeed: data[0].Wind.Speed.Metric.Value,
      forecast: data[0].WeatherText || "No forecast available",
      lastUpdated: new Date(),
      station,
    };
  } catch (error) {
    console.warn("API fetch failed, using mock data:", error);
    return generateMockWeatherData(station);
  }
};

// Fetch all stations
export const fetchAllStationsData = async (apiKey?: string): Promise<Map<string, WeatherData>> => {
  const dataMap = new Map<string, WeatherData>();
  
  const results = await Promise.all(
    MALAYSIA_STATIONS.map(station => fetchWeatherData(station, apiKey))
  );
  
  results.forEach(data => {
    dataMap.set(data.station.id, data);
  });
  
  return dataMap;
};
