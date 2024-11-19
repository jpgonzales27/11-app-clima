import styles from "./App.module.css";
import Form from "./components/form/Form";
import Spinner from "./components/spinner/Spinner";
import WeatherDetail from "./components/weatherDetail/WeatherDetail";
import useWeather from "./hooks/useWeather";

function App() {
  const { fetchWeather, weather, hasWeatherData, loading } = useWeather();

  return (
    <>
      <h1 className={styles.title}>Buscador de Clima</h1>
      <div className={styles.container}>
        <Form fetchWeather={fetchWeather} />
        {loading && <Spinner />}
        {hasWeatherData && <WeatherDetail weather={weather} />}
      </div>
    </>
  );
}

export default App;
