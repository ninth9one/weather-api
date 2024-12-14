import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lon: number;
  lat: number;
  name: string;
  state: string;
  country: string;
}

// TODO: Define a class for the Weather object
class Weather {
temperature: number;
precipitation: number;
pressure: number;
windSpeed: number;
clouds: number;

constructor(
  temperature: number,
  precipitation: number,
  pressure: number,
  windSpeed: number,
  clouds: number
) {
  this.temperature = temperature;
  this.precipitation = precipitation;
  this.pressure = pressure;
  this.windSpeed = windSpeed;
  this.clouds = clouds;
}}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  apiKey: string;
  cityName: string;
  constructor () {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/forecast';
    this.apiKey = 'b927d1b47e1c456ad7a3eb4bb8b3246e';
    this.cityName = 'KHERSON';
  }
  // TODO: Create fetchLocationData method
   private async fetchLocationData(query: string) {
      try {
        const response = await fetch(this.buildGeocodeQuery());
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Failed to fetch location data:", error);
        throw error;
      }
    }
  // TODO: Create destructureLocationData method
   private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData) {
      throw new Error('no data provided');
    }
  const { lon, lat, name, state, country } = locationData;
  const coordinates: Coordinates = {
lon, lat, name, state, country  }
return coordinates;
}
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const params = new URLSearchParams({
      q: this.cityName,
      appid: this.apiKey,
    });
  
    return `${this.baseURL}?${params.toString()}`;
  }  
  // TODO: Create buildWeatherQuery method
   private buildWeatherQuery(coordinates: Coordinates): string {
    const params = new URLSearchParams({
      lat: coordinates.lat.toString(),
      lon: coordinates.lon.toString(),
      appid: this.apiKey,
    });

    return `${this.baseURL}?${params.toString()}`;
   }
  // TODO: Create fetchAndDestructureLocationData method
   private async fetchAndDestructureLocationData() {
    try {
      // Fetch location data
      const locationData = await this.fetchLocationData(this.cityName);
      
      // Extract the coordinates (lat, lon) from the fetched data
      const coordinates = this.destructureLocationData({
        lon: locationData.coord.lon,
        lat: locationData.coord.lat,
        name: locationData.name,
        state: locationData.state || '',
        country: locationData.country,
      });
      
      return coordinates;
    } catch (error) {
      console.error("Failed to fetch and destructure location data:", error);
      throw error;
    }
  }
  // TODO: Create fetchWeatherData method
   private async fetchWeatherData(coordinates: Coordinates) {try {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    throw error;
  }}
  // TODO: Build parseCurrentWeather method
   private parseCurrentWeather(response: any) {
    return new Weather(
      response.main.temp,
      response.pop,
      response.main.pressure,
      response.wind.speed,
      response.clouds.all
    );
   }
   // TODO: Complete buildForecastArray method
   private buildForecastArray(currentWeather: Weather, weatherData: any) {
const weatherForecast: Weather[] = [currentWeather];
const filteredWeatherData = weatherData.filter((data: any) => {
  return data.dt_txt.includes('12:00:00');
});
for (const data of filteredWeatherData) {
  const weather = new Weather(
    data.main.temp,
    data.pop,
    data.main.pressure,
    data.wind.speed,
    data.clouds.all
  );
  weatherForecast.push(weather);
}
return weatherForecast;
   }
  // TODO: Complete getWeatherForCity method
   async getWeatherForCity() {
    try {
      const locationCoordinates: Coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(locationCoordinates);
      const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
      return this.buildForecastArray(currentWeather, weatherData.list);
    } catch (error) {
      console.error(`Failed to get weather for "${this.cityName}" `, error);
      throw error;
    }
   }
}

export default new WeatherService();
