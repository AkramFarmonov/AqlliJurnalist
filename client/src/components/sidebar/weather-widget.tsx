import { useQuery } from "@tanstack/react-query";
import { CloudSun } from "lucide-react";

interface WeatherData {
  current_weather?: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
  daily?: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    time: string[];
  };
}

export function WeatherWidget() {
  const { data, isLoading, error } = useQuery<WeatherData>({
    queryKey: ["weather", "tashkent"],
    queryFn: async () => {
      const url = "https://api.open-meteo.com/v1/forecast?latitude=41.2995&longitude=69.2401&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=Asia/Tashkent";
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Weather fetch failed");
      return res.json();
    },
    refetchInterval: 15 * 60 * 1000, // 15 min
  });

  const temp = Math.round(data?.current_weather?.temperature ?? 0);
  const todayMax = Math.round(data?.daily?.temperature_2m_max?.[0] ?? temp);
  const todayMin = Math.round(data?.daily?.temperature_2m_min?.[0] ?? temp);
  const day1 = Math.round(data?.daily?.temperature_2m_max?.[0] ?? temp);
  const day2 = Math.round(data?.daily?.temperature_2m_max?.[1] ?? temp);
  const day3 = Math.round(data?.daily?.temperature_2m_max?.[2] ?? temp);

  function iconFor(code?: number) {
    if (code == null) return "☁️";
    // Basic WMO mapping
    if (code === 0) return "☀️"; // clear
    if ([1, 2].includes(code)) return "🌤️"; // mainly clear/partly cloudy
    if (code === 3) return "☁️"; // overcast
    if ([45, 48].includes(code)) return "🌫️"; // fog
    if ([51, 53, 55, 56, 57].includes(code)) return "🌦️"; // drizzle
    if ([61, 63, 65, 66, 67].includes(code)) return "🌧️"; // rain
    if ([71, 73, 75, 77].includes(code)) return "🌨️"; // snow
    if ([80, 81, 82].includes(code)) return "🌧️"; // rain showers
    if ([95, 96, 97].includes(code)) return "⛈️"; // thunderstorm
    return "🌥️";
  }

  return (
    <section className="bg-card border border-border rounded-xl p-4" data-testid="widget-weather">
      <div className="flex items-center gap-2 mb-2">
        <CloudSun className="text-primary" />
        <h3 className="text-sm font-semibold">Ob-havo · Toshkent</h3>
      </div>
      {isLoading ? (
        <div className="h-16 rounded-lg bg-muted animate-pulse" />
      ) : error ? (
        <p className="text-sm text-muted-foreground">Ma'lumot yuklanmadi</p>
      ) : (
        <div>
          <div className="text-3xl font-bold flex items-center gap-2">
            <span>{iconFor(data?.current_weather?.weathercode)}</span>
            <span>{temp}°C</span>
          </div>
          <p className="text-sm text-muted-foreground">Bugun: {todayMin}° / {todayMax}°</p>
          <p className="text-xs text-muted-foreground mt-1">Shamol: {Math.round(data?.current_weather?.windspeed ?? 0)} m/s</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-md bg-muted/40 py-2">
              <div className="text-xs text-muted-foreground">Bugun</div>
              <div className="text-sm font-semibold">{day1}°C</div>
            </div>
            <div className="rounded-md bg-muted/40 py-2">
              <div className="text-xs text-muted-foreground">Erta</div>
              <div className="text-sm font-semibold">{day2}°C</div>
            </div>
            <div className="rounded-md bg-muted/40 py-2">
              <div className="text-xs text-muted-foreground">Indinga</div>
              <div className="text-sm font-semibold">{day3}°C</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
