import * as fs from 'fs/promises';

// Define a City class with name and id properties
class City {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

// Complete the HistoryService class
class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = 'searchHistory.json';
  }

  // Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to read search history:', error);
      return [];
    }
  }

  // Define a write method that writes to the searchHistory.json file
  async write(cities: City[]): Promise<void> {
    try {
      const data = JSON.stringify(cities, null, 2);
      await fs.writeFile(this.filePath, data, 'utf8');
    } catch (error) {
      console.error('Failed to write search history:', error);
    }
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: City): Promise<void> {
    try {
      const cities = await this.getCities();
      cities.push(city);
      await this.write(cities);
    } catch (error) {
      console.error('Failed to add city:', error);
      throw error;
    }
  }

  // BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(cityName: string): Promise<Boolean> {
    try {
      const cities = await this.getCities();
      const cityIndex = cities.findIndex(city => city.name === cityName);
      if (cityIndex === -1) {
        console.log(`${cityName} not found in list`);
        return false;
      }
      cities.splice(cityIndex, 1);
      await this.write(cities);
      console.log(`City "${cityName}" removed successfully.`);
      return true;
    } catch (error) {
      console.error('Failed to remove city:', error);
      return false;
    }
  }
}

export default new HistoryService();