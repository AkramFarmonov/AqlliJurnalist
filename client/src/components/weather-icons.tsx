import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun } from "lucide-react";

export function WeatherIcon({ 
  code, 
  size = 20, 
  className = '' 
}: { 
  code?: number; 
  size?: number; 
  className?: string 
}) {
  if (code == null) return <Cloud size={size} />;
  
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  switch (code) {
    case 0: // Clear sky
      return <Sun size={size} className={`text-yellow-500 ${className}`} />;
    case 1: // Mainly clear
    case 2: // Partly cloudy
      return <CloudSun size={size} className={`text-yellow-500 ${className}`} />;
    case 3: // Overcast
      return <Cloud size={size} className={`text-gray-400 ${className}`} />;
    case 45: // Fog
    case 48: // Depositing rime fog
      return <CloudFog size={size} className={`text-gray-300 ${className}`} />;
    case 51: // Light drizzle
    case 53: // Moderate drizzle
    case 55: // Dense drizzle
    case 56: // Light freezing drizzle
    case 57: // Dense freezing drizzle
      return <CloudDrizzle size={size} className={`text-blue-400 ${className}`} />;
    case 61: // Slight rain
    case 63: // Moderate rain
    case 65: // Heavy rain
    case 80: // Slight rain showers
    case 81: // Moderate rain showers
    case 82: // Violent rain showers
      return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
    case 71: // Slight snow fall
    case 73: // Moderate snow fall
    case 75: // Heavy snow fall
    case 77: // Snow grains
      return <CloudSnow size={size} className={`text-blue-200 ${className}`} />;
    case 95: // Thunderstorm
    case 96: // Thunderstorm with slight hail
    case 99: // Thunderstorm with heavy hail
      return <CloudLightning size={size} className={`text-yellow-400 ${className}`} />;
    default:
      return <Cloud size={size} className={`text-gray-400 ${className}`} />;
  }
}
