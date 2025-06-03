import { Sun, Cloud, CloudRain, Moon, Snowflake, CloudFog, CloudLightning } from 'lucide-react';

interface WeatherIllustrationProps {
  condition: string;
  hour: string;
}

export const WeatherIllustration = ({ condition, hour }: WeatherIllustrationProps) => {
  const getWeatherCategory = (condition: string) => {
    const lowerCondition = condition.toLowerCase();

    if (lowerCondition.includes('sol') || lowerCondition.includes('claro')) {
      return 'clear';
    }
    if (lowerCondition.includes('nuvem') || lowerCondition.includes('nublado') || lowerCondition.includes('encoberto') || lowerCondition.includes('algumas nuvens')) {
      return 'cloud';
    }
    if (lowerCondition.includes('chuva') || lowerCondition.includes('pancada')) {
      return 'rain';
    }
    if (lowerCondition.includes('trovoada')) {
      return 'rain-thunder';
    }
    if (lowerCondition.includes('neve') || lowerCondition.includes('granizo') || lowerCondition.includes('congelante')) {
      return 'snow';
    }
    if (lowerCondition.includes('neblina') || lowerCondition.includes('névoa') || lowerCondition.includes('fumaça') || lowerCondition.includes('bruma')) {
      return 'fog';
    }

    return 'default';
  };

  const isDaytime = (hour: string) => {
  const [date, timeRaw] = hour.split(',');
  const time = timeRaw.trim();
  
  const isDay = time >= '06:00:00' && time <= '18:00:00';
  
  return isDay;
};


  const category = getWeatherCategory(condition);
  const daytime = isDaytime(hour);

  const renderIllustration = () => {
    switch (category) {
      case 'clear':
        return daytime ? (
          <div className="relative">
            <Sun className="h-32 w-32 text-yellow-400 animate-pulse-slow" />
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
              <div className="h-2 w-2 bg-yellow-300 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2" />
              <div className="h-2 w-2 bg-yellow-300 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2" />
              <div className="h-2 w-2 bg-yellow-300 rounded-full absolute left-0 top-1/2 transform -translate-y-1/2" />
              <div className="h-2 w-2 bg-yellow-300 rounded-full absolute right-0 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        ) : (
          <div className="relative">
            <Moon className="h-32 w-32 text-blue-200 animate-pulse-slow" />
            <div className="absolute inset-0">
              <div className="h-1 w-1 bg-white rounded-full absolute top-4 right-8 animate-pulse" />
              <div className="h-1 w-1 bg-white rounded-full absolute top-12 right-4 animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="h-1 w-1 bg-white rounded-full absolute top-8 right-12 animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
          </div>
        );

      case 'cloud':
        return (
          <div className="relative">
            <Cloud className="h-32 w-32 text-gray-400 animate-float" />
            <Cloud className="h-20 w-20 text-gray-300 absolute top-8 -right-6 animate-float" style={{ animationDelay: '1s' }} />
          </div>
        );

      case 'rain':
        return (
          <div className="relative">
            <CloudRain className="h-32 w-32 text-blue-500 animate-float" />
          </div>
        );

      case 'rain-thunder':
        return (
          <div className="relative">
            <CloudLightning className="h-32 w-32 text-yellow-400 animate-float" />
          </div>
        );

      case 'snow':
        return (
          <div className="relative">
            <Snowflake className="h-32 w-32 text-blue-200 animate-float" />
          </div>
        );

      case 'fog':
        return (
          <div className="relative">
            <CloudFog className="h-32 w-32 text-gray-400 animate-float" />
          </div>
        );

      default:
        return daytime ? (
          <Sun className="h-32 w-32 text-yellow-400 animate-pulse-slow" />
        ) : (
          <Moon className="h-32 w-32 text-blue-200 animate-pulse-slow" />
        );
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">{renderIllustration()}</div>
    </div>
  );
};
