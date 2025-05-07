"use client"; // Required for useState and event handlers

import { useState, useEffect } from "react";
import Image from "next/image"; // Keep Image for potential weather icons

// Define a more specific type for the weather data
interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  weather: {
    icon: string;
    description: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  visibility?: number; // Optional, as it might not always be present
}

// Placeholder for forecast data structure - this will need to be refined
interface ForecastDay {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    icon: string;
    description: string;
  }[];
}

interface ForecastData extends WeatherData { // Extends current weather for simplicity, might need dedicated type
  forecast?: ForecastDay[];
}

export default function Home() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<ForecastData | null>(null); // Use the defined interface
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (cityName: string) => {
    if (!cityName.trim()) {
      setError("Please enter a city name.");
      setWeatherData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null); // Clear previous data

    try {
      // Call our Laravel backend API
      // Assuming backend is running on http://localhost:8000
      // TODO: Update backend to potentially send forecast data too
      const response = await fetch(
        `http://localhost:8000/api/weather?city=${encodeURIComponent(cityName)}`
      );

      const data = await response.json(); // Always parse JSON to get error messages from backend

      if (!response.ok) {
        throw new Error(data.error || `Failed to fetch weather data: ${response.statusText}`);
      }

      // For now, manually adding placeholder forecast data until backend is updated
      // This is just for UI demonstration
      const placeholderForecast: ForecastDay[] = [
        { dt: Date.now() / 1000 + 24 * 60 * 60, main: { temp: 22 }, weather: [{ icon: "01d", description: "clear sky" }] },
        { dt: Date.now() / 1000 + 2 * 24 * 60 * 60, main: { temp: 21 }, weather: [{ icon: "02d", description: "few clouds" }] },
        { dt: Date.now() / 1000 + 3 * 24 * 60 * 60, main: { temp: 23 }, weather: [{ icon: "01d", description: "clear sky" }] },
      ];

      setWeatherData({ ...data, forecast: placeholderForecast });

    } catch (err: any) {
      setError(err.message || "An unknown error occurred while fetching data.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  const getCurrentFormattedDate = () => {
    return new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getFormattedForecastDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short", // "May" instead of "long" for brevity in forecast cards
    });
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-200 via-indigo-100 to-blue-100 flex flex-col items-center text-gray-700 font-sans">
      {/* Search Bar Area */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-lg mb-8 mt-4 flex items-center bg-white/90 backdrop-blur-lg shadow-xl rounded-full p-2.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 mx-3 text-gray-400">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11ZM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9Z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search"
          className="input-ghost flex-grow bg-transparent focus:outline-none placeholder-gray-500 text-lg"
          disabled={loading}
        />
        <button
          type="button"
          className="btn btn-circle btn-md bg-purple-500 hover:bg-purple-600 text-white font-bold text-md mr-1 shadow-md"
          // onClick={() => { /* TODO: Implement C/F toggle */ }}
          disabled={loading}
        >
          °C
        </button>
      </form>

      {/* Error Display */}
      {error && !loading && (
        <div className="alert alert-error max-w-lg mb-6 shadow-lg text-white bg-red-500/90">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center my-10">
          <span className="loading loading-dots loading-lg text-purple-600"></span>
          <p className="mt-3 text-lg text-purple-700">Fetching weather...</p>
        </div>
      )}

      {/* Main Content Area - Grid Layout */}
      {!loading && weatherData && !error && (
        <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Left Main Card */}
          <div className="md:col-span-2 card bg-white/90 backdrop-blur-lg shadow-2xl p-6 rounded-3xl flex flex-col items-center text-center min-h-[360px]">
            {weatherData.weather[0].icon && (
              <Image
                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                alt={weatherData.weather[0].description}
                width={150}
                height={150}
                className="-mt-10 mb-0" // Pull icon up a bit more
              />
            )}
            <p className="text-7xl font-bold text-gray-800 mt-[-10px]">
              {Math.round(weatherData.main.temp)}°C
            </p>
            <p className="text-2xl text-gray-600 capitalize mb-5">
              {weatherData.weather[0].description}
            </p>
            <div className="w-full bg-white/70 backdrop-blur-sm p-3.5 rounded-xl shadow-inner mt-auto">
              <p className="text-md font-medium text-gray-700">{getCurrentFormattedDate()}</p>
              <p className="text-lg font-semibold text-gray-800">{weatherData.name}</p>
            </div>
          </div>

          {/* Right Column for Smaller Cards (Forecast) */}
          <div className="grid grid-rows-3 gap-4">
            {weatherData.forecast?.map((day, index) => (
              <div key={index} className="card bg-white/90 backdrop-blur-lg shadow-xl p-3 rounded-2xl flex flex-col items-center justify-center text-center min-h-[113px]">
                <p className="text-xs font-medium text-gray-500">{getFormattedForecastDate(day.dt)}</p>
                {day.weather[0].icon && (
                  <Image
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                    width={50}
                    height={50}
                  />
                )}
                <p className="text-lg font-bold text-gray-800">{Math.round(day.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wind and Humidity Cards - Below Main Section */}
      {!loading && weatherData && !error && (
        <div className="w-full max-w-lg grid grid-cols-2 gap-5 mt-5">
          {/* Wind Card */}
          <div className="card bg-white/90 backdrop-blur-lg shadow-xl p-5 rounded-2xl flex flex-col items-center text-center min-h-[150px]">
            <p className="text-md font-semibold text-gray-500 mb-1">Wind</p>
            {/* Using a simple wind SVG icon */}
            <svg className="w-10 h-10 text-purple-500 mb-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 6.75h16.5" filter="url(#wind-blur)" />
              <defs><filter id="wind-blur"><feGaussianBlur in="SourceGraphic" stdDeviation="0.3" /></filter></defs>
            </svg>
            <p className="text-2xl font-bold text-gray-800">
              {weatherData.wind.speed} <span className="text-sm">m/s</span>
            </p>
          </div>

          {/* Humidity Card */}
          <div className="card bg-white/90 backdrop-blur-lg shadow-xl p-5 rounded-2xl flex flex-col items-center text-center min-h-[150px]">
            <p className="text-md font-semibold text-gray-500 mb-1">Humidity</p>
            {/* Using a simple humidity SVG icon */}
            <svg className="w-10 h-10 text-blue-500 mb-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048l5.962-5.962a.75.75 0 011.06.001z" filter="url(#drop-blur)" />
              <defs><filter id="drop-blur"><feGaussianBlur in="SourceGraphic" stdDeviation="0.3" /></filter></defs>
            </svg>
            <p className="text-2xl font-bold text-gray-800">
              {weatherData.main.humidity}%
            </p>
          </div>
        </div>
      )}

      {/* Bottom location display - as per wireframe */}
      {!loading && weatherData && !error && (
        <div className="w-full max-w-lg mt-5 mb-4">
          <div className="bg-white/90 backdrop-blur-lg shadow-xl p-3.5 rounded-full text-center">
            <p className="text-md font-semibold text-gray-800">{weatherData.name}</p>
          </div>
        </div>
      )}

      {/* Initial placeholder message */}
      {!weatherData && !error && !loading && (
        <div className="text-center mt-10 p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Your Weather App!</h2>
          <p className="text-gray-600">Enter a city name in the search bar above to get the latest weather information and a 3-day forecast.</p>
        </div>
      )}
    </div>
  );
}
