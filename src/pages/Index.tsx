import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search, MapPin, Moon, Sun, Wind, Droplets, Eye, Thermometer } from 'lucide-react';
import { WeatherCard } from '../components/WeatherCard';
import { ForecastCard } from '../components/ForecastCard';
import { WeatherIllustration } from '../components/WeatherIllustration';

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

interface ForecastData {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  async function getCoordenada(city: string, state = '', country = '') {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},${encodeURIComponent(state)},${encodeURIComponent(country)}&limit=1&appid=${import.meta.env.VITE_API_KEY}`
    );
    const data = await response.json();
    if (data.length > 0) return data[0];
    throw new Error('Localização não encontrada');
  }

  async function getWeatherData(lat: number, lon: number) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_KEY}&units=metric&lang=pt_br`
    );
    if (!response.ok) throw new Error('Erro ao buscar dados do tempo');
    return await response.json();
  }

  async function getForecastData(lat: number, lon: number) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_KEY}&units=metric&lang=pt_br&cnt=40`
    );
    if (!response.ok) throw new Error('Erro ao buscar previsão do tempo');
    const data = await response.json();
    return data.list;
  }

  async function getTimezone(lat: number, lon: number) {
    const response = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=${import.meta.env.VITE_API_KEY_HORA}&format=json&by=position&lat=${lat}&lng=${lon}`);

    if(!response.ok) throw new Error('Erro ao buscar fuso horário');
    const data = await response.json();
    return data;
  }

  async function getLocalInfo(lat: number, lon: number) {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=pt`);

    if(!response.ok) throw new Error('Erro ao buscar informações locais');
    const data = await response.json();
    return data.address;
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError('');

    try {
      const coordenada = await getCoordenada(searchQuery);
      const dadosTempo = await getWeatherData(coordenada.lat, coordenada.lon);
      console.log("Dados do tempo:", dadosTempo);
      const previsao = await getForecastData(coordenada.lat, coordenada.lon);
      const timezone = await getTimezone(coordenada.lat, coordenada.lon);
      const localInfo = await getLocalInfo(coordenada.lat, coordenada.lon);

      const [datePart, timePart] = timezone.formatted.split(' ');
      const [year, month, day] = datePart.split('-');
      const formattedDate = `${day}/${month}/${year}, ${timePart}`;


      const weatherData: WeatherData = {
        city: localInfo.town || localInfo.city || localInfo.village || localInfo.hamlet,
        country: localInfo.country,
        state: localInfo.state,
        temp: dadosTempo.main.temp,
        condition: dadosTempo.weather[0].description,
        humidity: dadosTempo.main.humidity,
        windSpeed: dadosTempo.wind.speed,
        visibility: Math.round(dadosTempo.visibility / 1000),
        feels_like: dadosTempo.main.feels_like,
        localTime: formattedDate,
        icon: dadosTempo.weather[0].description
      };

      const todayStr = new Date().toLocaleDateString('pt-BR');

      const groupedByDay: { [key: string]: any[] } = {};
      previsao.forEach((element: any) => {
        const dateObj = new Date(element.dt * 1000);
        const dateStr = dateObj.toLocaleDateString('pt-BR');
        if (dateStr === todayStr) return;
        const date = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
        if (!groupedByDay[date]) groupedByDay[date] = [];
        groupedByDay[date].push(element);
      });

      const forecastData: ForecastData[] = Object.entries(groupedByDay).slice(0, 5).map(([day, elements]) => {
        let minTemp = Infinity, maxTemp = -Infinity;
        const conditionCount: { [key: string]: number } = {};
        const iconCount: { [key: string]: number } = {};

        elements.forEach(el => {
          if (el.main.temp_min < minTemp) minTemp = el.main.temp_min;
          if (el.main.temp_max > maxTemp) maxTemp = el.main.temp_max;
          const condition = el.weather[0].description;
          const icon = el.weather[0].description;
          conditionCount[condition] = (conditionCount[condition] || 0) + 1;
          iconCount[icon] = (iconCount[icon] || 0) + 1;
        });

        const predominantCondition = Object.keys(conditionCount).reduce((a, b) => conditionCount[a] > conditionCount[b] ? a : b);
        const predominantIcon = Object.keys(iconCount).reduce((a, b) => iconCount[a] > iconCount[b] ? a : b);

        return {
          date: day,
          maxTemp: Math.round(maxTemp),
          minTemp: Math.round(minTemp),
          condition: predominantCondition,
          icon: predominantIcon
        };
      });

      setCurrentWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar dados meteorológicos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo seu navegador');
      return;
    }
    setSearchQuery('');
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const dadosTempo = await getWeatherData(latitude, longitude);
          const previsao = await getForecastData(latitude, longitude);
          const timezone = await getTimezone(latitude, longitude);
          const localInfo = await getLocalInfo(latitude, longitude);

          const [datePart, timePart] = timezone.formatted.split(' ');

          const [year, month, day] = datePart.split('-');

          const formattedDate = `${day}/${month}/${year}, ${timePart}`;

          const weatherData: WeatherData = {
            city: localInfo.town || localInfo.city,
            country: localInfo.country,
            state: localInfo.state ,
            temp: dadosTempo.main.temp,
            condition: dadosTempo.weather[0].description,
            humidity: dadosTempo.main.humidity,
            windSpeed: dadosTempo.wind.speed,
            visibility: Math.round(dadosTempo.visibility / 1000),
            feels_like: dadosTempo.main.feels_like,
            localTime: formattedDate,
            icon: dadosTempo.weather[0].description
          };

          const groupedByDay: { [key: string]: any[] } = {};
          previsao.forEach((element: any) => {
            const date = new Date(element.dt * 1000).toLocaleDateString('pt-BR', { weekday: 'long' });
            if (!groupedByDay[date]) groupedByDay[date] = [];
            groupedByDay[date].push(element);
          });

          const forecastData: ForecastData[] = Object.entries(groupedByDay).slice(0, 5).map(([day, elements]) => {
            let minTemp = Infinity, maxTemp = -Infinity;
            const conditionCount: { [key: string]: number } = {};
            const iconCount: { [key: string]: number } = {};

            elements.forEach(el => {
              if (el.main.temp_min < minTemp) minTemp = el.main.temp_min;
              if (el.main.temp_max > maxTemp) maxTemp = el.main.temp_max;
              const condition = el.weather[0].description;
              const icon = el.weather[0].description;
              conditionCount[condition] = (conditionCount[condition] || 0) + 1;
              iconCount[icon] = (iconCount[icon] || 0) + 1;
            });

            const predominantCondition = Object.keys(conditionCount).reduce((a, b) => conditionCount[a] > conditionCount[b] ? a : b);
            const predominantIcon = Object.keys(iconCount).reduce((a, b) => iconCount[a] > iconCount[b] ? a : b);

            return {
              date: day,
              maxTemp: Math.round(maxTemp),
              minTemp: Math.round(minTemp),
              condition: predominantCondition,
              icon: predominantIcon
            };
          });

          setCurrentWeather(weatherData);
          setForecast(forecastData);
        } catch (err) {
          console.error(err);
          setError('Erro ao obter localização');
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setError('Erro ao acessar localização');
        setIsLoading(false);
      }
    );
  };

  const getBackgroundGradient = () => {
    if (!currentWeather) return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
    const icon = currentWeather.icon;
    if (icon.includes('01')) return 'bg-sunny-gradient';
    if (icon.includes('02') || icon.includes('03') || icon.includes('04')) return 'bg-cloudy-gradient';
    if (icon.includes('09') || icon.includes('10')) return 'bg-rainy-gradient';
    return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ${getBackgroundGradient()} ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-black/20 dark:bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Previsão do Tempo</h1>
            <div className="flex items-center space-x-2">
              <Sun className="h-5 w-5 text-yellow-300" />
              <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} className="data-[state=checked]:bg-slate-600" />
              <Moon className="h-5 w-5 text-blue-200" />
            </div>
          </div>

          <Card className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Digite o nome da cidade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSearch} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? 'Buscando...' : 'Buscar'}
                  </Button>
                  <Button variant="outline" onClick={handleGeolocation} disabled={isLoading} className="border-blue-300 text-blue-600 hover:bg-blue-50">
                    <MapPin className="h-4 w-4 mr-2" />
                    Minha Localização
                  </Button>
                </div>
              </div>
              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            </CardContent>
          </Card>

          {currentWeather ? (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                  <WeatherCard weather={currentWeather} />
                </div>
                <div className="flex justify-center items-center">
                  <WeatherIllustration condition={currentWeather.icon} hour={currentWeather.localTime} />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { Icon: Thermometer, label: 'Sensação', value: `${currentWeather.feels_like}°C`, color: 'text-orange-500' },
                { Icon: Droplets, label: 'Umidade', value: `${currentWeather.humidity}%`, color: 'text-blue-500' },
                { Icon: Wind, label: 'Vento', value: `${currentWeather.windSpeed} km/h`, color: 'text-green-500' },
                { Icon: Eye, label: 'Visibilidade', value: `${currentWeather.visibility} km`, color: 'text-purple-500' }
              ].map(({ Icon, label, value, color }, i) => (
                <Card key={i} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
                  <CardContent className="p-4 text-center">
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${color}`} />
                    <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
                    <p className="text-2xl font-bold">{value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>


              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-center">Previsão para os próximos 5 dias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {forecast.map((day, index) => <ForecastCard key={index} forecast={day} />)}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : !isLoading && (
            <div className="text-center text-white mt-20">
              <div className="animate-pulse-slow">
                <Sun className="h-24 w-24 mx-auto mb-4 text-yellow-300" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Bem-vindo ao Weather App</h2>
              <p className="text-lg opacity-90">Digite uma cidade ou use sua localização para ver a previsão do tempo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
