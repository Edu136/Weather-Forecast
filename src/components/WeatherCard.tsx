import { Card, CardContent } from "@/components/ui/card";

interface WeatherData {
  city: string;
  country: string;
  state: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  feels_like: number;
  localTime: string;
  icon: string;
}

interface WeatherCardProps {
  weather: WeatherData;
}

export const WeatherCard = ({  weather }: WeatherCardProps) => {
  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-0 shadow-2xl">
      <CardContent className="p-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
            {weather.city}{weather.state ? `, ${weather.state}` : ""},{weather.country}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {weather.localTime}
          </p>

          <div className="flex items-center justify-center md:justify-start mb-4">
            <span className="text-7xl md:text-8xl font-light text-gray-800 dark:text-white">
              {weather.temp}
            </span>
            <span className="text-4xl font-light text-gray-600 dark:text-gray-300 ml-2">
              °C
            </span>
          </div>

          <p className="text-2xl text-gray-700 dark:text-gray-200 capitalize">
            {weather.condition}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
