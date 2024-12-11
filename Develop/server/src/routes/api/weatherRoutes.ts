import { Router, Request, Response } from 'express';
import https from 'https';
import historyService from '../../service/historyService';
import WeatherService from '../../service/weatherService';
const router = Router()

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const cityName = req.body.city;
  if (!cityName) {
    res.status(400).json({ error: 'City name is required' });
    return;
  }
  try { const weatherData = await WeatherService.getWeatherForCity(cityName);
    res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

  // TODO: GET weather data from city name
  router.get('/:city', (req: Request, res: Response): any => {
    const cityName = req.params.city;
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.WEATHER_API_KEY}`;
    https.get(url, (apiRes) => {
      let data = '';
      apiRes.on('data', (chunk) => {
        data += chunk;
    });
    apiRes.on('end', () => {
      try {
          const weatherData = JSON.parse(data);
          if (apiRes.statusCode === 200) {
              res.status(200).json(weatherData); // Respond with the weather data
          } else {
              res.status(apiRes.statusCode || 500).json({ error: weatherData.message });
          }
      } catch (error) {
          res.status(500).json({ error: 'Error parsing response from weather API' });
      }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Error connecting to weather API' });
});
});

  // TODO: save city to search history
async function saveCityToHistory(cityName: string) {
  try {
const cityId = Date.now();
const city = { name: cityName, id: cityId };
await historyService.addCity(city);
console.log(`City ${cityName} saved to history`);
  } catch (error) {
    console.error('error saving city to search history', error);
}
    }
// TODO: GET search history
router.get('/history', async (req, res) => {
  try {
    const cities = await historyService.getCities();
    res.status(200).json({
        success: true,
        data: cities.length > 0 ? cities : 'No cities found in search history',
    });
} catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({
        success: false,
        message: 'Failed to fetch search history',
    });
}
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const cityId = req.params.id;
    const result = await historyService.removeCity(cityId);
    if (result) {
      res.status(200).json({ success: true, message: 'City deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'City not found' });
    }
  } catch (error) {
    console.error('Error deleting city from history:', error);
    res.status(500).json({ success: false, message: 'Failed to delete city' });
  }
});

export default router;
