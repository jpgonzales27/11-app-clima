import axios from "axios";
import { SearchType, Wheather } from "../types";
import { z } from "zod";
import { useMemo, useState } from "react";
// import { object, string, number, InferOutput, parse } from "valibot";

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

export type Weather = z.infer<typeof Weather>;

// Valibot
// const WeatherSchema = object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_max: number(),
//     temp_min: number(),
//   }),
// });
// export type Weather = InferOutput<typeof WeatherSchema>;

const initialState = {
  name: "",
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0,
  },
};

export default function useWeather() {
  const [weather, setWeather] = useState<Wheather>(initialState);

  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchWeather = async (search: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY;
    setLoading(true);
    setWeather(initialState);
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;
      const { data } = await axios(geoUrl);

      if (!data[0]) {
        setNotFound(true);
        return;
      }

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
        setWeather(result.data);
      }

      // Valibot
      // const { data: weatherResult } = await axios(weatherUrl);
      // const result = parse(WeatherSchema, weatherResult);
      // if (result) {
      //   console.log(result.name);
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const hasWeatherData = useMemo(() => weather.name, [weather]);
  return {
    notFound,
    loading,
    weather,
    fetchWeather,
    hasWeatherData,
  };
}
