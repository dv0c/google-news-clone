"use client";

import { MapPin, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type WeatherData = {
  temp: number;
  city: string;
  icon: string;
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Replace with your OpenWeather API key
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Get user location (geolocation API)
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;

          // Fetch weather from OpenWeather
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=el&appid=${API_KEY}`
          );
          const data = await res.json();

          setWeather({
            temp: Math.round(data.main.temp),
            city: data.name,
            icon: data.weather[0].icon,
          });
          setLoading(false);
        });
      } catch (err) {
        console.error("Weather fetch error", err);
        setLoading(false);
      }
    }

    fetchWeather();
  }, [API_KEY]);

  return (
    <div>
      <div className="relative flex items-center rounded-2xl bg-[#1f1f1f] gap-4 max-w-2xl">
        {/* Weather Display */}
        <div className="relative flex gap-2 items-center bg-[#1f1f1f] rounded-2xl px-5 py-2 text-white w-full">
          <div className="relative">
            {weather ? (
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt="weather icon"
                className="h-12 w-12"
              />
            ) : (
              <Sun
                style={{ animation: "spin 10s linear infinite" }}
                className="h-12 w-12 text-yellow-400 fill-yellow-400"
              />
            )}
          </div>
          <div className="flex flex-col">
            {/* Location */}
            <div className="flex items-center gap-2 justify-center">
              <span className="text-xs text-gray-300">
                Ο καιρός στην τοποθεσία σας
              </span>
              <MapPin className="h-4 w-4 text-gray-300" />
            </div>

            {/* Temperature */}
            <div className="flex items-center gap-4">
              <div className="text-2xl font-semibold">
                {loading
                  ? "..."
                  : weather
                  ? `${weather.temp}°C`
                  : "Δεν βρέθηκαν δεδομένα"}
              </div>
            </div>

            {/* City Name */}
            <div>
              <span className="text-blue-400 text-xs">
                {weather?.city ?? "καιρός Google"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
