"use client"; // Required for useState and event handlers

import { useState, useEffect } from "react";
import Image from "next/image"; // Keep Image for potential weather icons

export default function Home() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null); // Replace 'any' with a proper type later
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder for API key - replace with your actual key or a secure way to store it
  const OPENWEATHERMAP_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";

  const fetchWeatherData = async (cityName: string) => {
    if (!cityName.trim()) {
      setError("Please enter a city name.");
      setWeatherData(null);
      return;
    }
    if (OPENWEATHERMAP_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
      setError("OpenWeatherMap API key is not configured.");
      setWeatherData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      // TODO: Replace with a call to our Laravel backend
      // For now, directly calling OpenWeatherMap for demonstration (not recommended for production)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
      );
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found.");
        } else if (response.status === 401) {
          throw new Error("Invalid API key. Please check your OpenWeatherMap API key.");
        } else {
          throw new Error(`Failed to fetch weather data: ${response.statusText}`);
        }
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchWeatherData(city);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 lg:p-24 bg-base-100 text-base-content">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-8">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-neutral bg-base-300 p-4 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-base-200 lg:p-4">
          Weather App
        </p>
        <div className="fixed bottom-0 left-0 flex h-32 w-full items-end justify-center bg-gradient-to-t from-base-100 via-base-100 lg:static lg:h-auto lg:w-auto lg:bg-none">
          {/* Placeholder for potential logo or branding */}
        </div>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="w-full max-w-md mb-10 flex gap-2"
      >
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="input input-bordered input-primary flex-grow"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Search"
          )}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="alert alert-error max-w-md mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! {error}</span>
        </div>
      )}

      {/* Weather Display Card */}
      {weatherData && !error && (
        <div className="card w-full max-w-2xl bg-base-200 shadow-xl text-base-content">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-3xl mb-2">
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <p className="text-sm mb-4">{getCurrentDate()}</p>

            <div className="flex items-center mb-4">
              {weatherData.weather[0].icon && (
                <Image
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt={weatherData.weather[0].description}
                  width={100}
                  height={100}
                />
              )}
              <div>
                <p className="text-6xl font-bold">
                  {Math.round(weatherData.main.temp)}°C
                </p>
                <p className="text-xl capitalize">
                  {weatherData.weather[0].description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left w-full max-w-md mb-4">
              <div>
                <p className="font-semibold">Feels like</p>
                <p>{Math.round(weatherData.main.feels_like)}°C</p>
              </div>
              <div>
                <p className="font-semibold">Min/Max Temp</p>
                <p>
                  {Math.round(weatherData.main.temp_min)}°C /{" "}
                  {Math.round(weatherData.main.temp_max)}°C
                </p>
              </div>
              <div>
                <p className="font-semibold">Wind</p>
                <p>{weatherData.wind.speed} m/s</p>
              </div>
              <div>
                <p className="font-semibold">Humidity</p>
                <p>{weatherData.main.humidity}%</p>
              </div>
              <div>
                <p className="font-semibold">Pressure</p>
                <p>{weatherData.main.pressure} hPa</p>
              </div>
              {weatherData.visibility && (
                 <div>
                   <p className="font-semibold">Visibility</p>
                   <p>{weatherData.visibility / 1000} km</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!weatherData && !error && !loading && (
        <div className="text-center text-neutral-content/70">
          <p>Enter a city to get the latest weather information.</p>
        </div>
      )}
    </main>
  );
}
