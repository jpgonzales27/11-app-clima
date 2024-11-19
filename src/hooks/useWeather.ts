import axios from "axios";
import { SearchType } from "../types";
import { z } from "zod";

// TYPE GUARD O ASSERTION
// function isWeatherResponse(weather: unknown): weather is Wheather {
//   return (
//     Boolean(weather) &&
//     typeof weather === "object" &&
//     typeof (weather as Wheather).name === "string" &&
//     typeof (weather as Wheather).main.temp === "number" &&
//     typeof (weather as Wheather).main.temp_max === "number" &&
//     typeof (weather as Wheather).main.temp_min === "number"
//   );
// }

// ZOD
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
});

type Weather = z.infer<typeof Weather>;

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
      //   const { data: weatherResult } = await axios(weatherUrl);
      //   const result = isWeatherResponse(weatherResult);
      //   if (result) {
      //     console.log(weatherResult.name);
      //   } else {
      //     console.log("Respuesta mal formada");
      //   }

      // Zod
      const { data: weatherResult } = await axios(weatherUrl);
      const result = Weather.safeParse(weatherResult);
      if (result.success) {
        console.log(result.data.name);
        console.log(result.data.main.temp);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    fetchWeather,
  };
}
