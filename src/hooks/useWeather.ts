import axios from "axios";
import { SearchType, Wheather } from "../types";

// TYPE GUARD O ASSERTION
function isWeatherResponse(weather: unknown): weather is Wheather {
  return (
    Boolean(weather) &&
    typeof weather === "object" &&
    typeof (weather as Wheather).name === "string" &&
    typeof (weather as Wheather).main.temp === "number" &&
    typeof (weather as Wheather).main.temp_max === "number" &&
    typeof (weather as Wheather).main.temp_min === "number"
  );
}

export default function useWeather() {
  const fetchWeather = async (search: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY;

    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;
      const { data } = await axios(geoUrl);
      const lat = data[0].lat;
      const lon = data[0].lon;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

      //Castear el type para el response
      // const { data: weatherData } = await axios<Wheather>(weatherUrl);
      // console.log(weatherData);
      // console.log(weatherData.name);
      // console.log(weatherData.main.temp);
      // console.log(weatherData.main.temp_max);
      // console.log(weatherData.main.temp_min);

      // Type Guards
      const { data: weatherResult } = await axios(weatherUrl);
      const result = isWeatherResponse(weatherResult);
      if (result) {
        console.log(weatherResult.name);
      } else {
        console.log("Respuesta mal formada");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    fetchWeather,
  };
}
