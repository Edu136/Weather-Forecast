import { Card, CardContent } from "@/components/ui/card";
import { Sun, Cloud, CloudRain } from 'lucide-react';

interface ForecastData {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
}

interface ForecastCardProps {
  forecast: ForecastData;
}

export const ForecastCard = ({ forecast }: ForecastCardProps) => {
  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'céu limpo':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'nublado':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'chuva leve':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'nuvens dispersas':
        return (
          <div className="relative">
            <Cloud className="h-8 w-8 text-gray-400" />
            <Sun className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
          </div>
        );
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <Card className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-0 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300 transform hover:scale-105">
      <CardContent className="p-4 text-center">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
          {forecast.date}
        </p>
        
        <div className="flex justify-center mb-3">
          {getWeatherIcon(forecast.icon)}
        </div>
        
        <div className="space-y-1">
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            {forecast.maxTemp}°
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {forecast.minTemp}°
          </p>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 capitalize">
          {forecast.condition}
        </p>
      </CardContent>
    </Card>
  );
};
