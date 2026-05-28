import { motion } from "framer-motion";
import { Cloud, Droplets, Wind } from "lucide-react";

const weatherData = {
  temperature: 24,
  feelsLike: 25,
  condition: "Ensolarado",
  humidity: 58,
  wind: "10 km/h SE",
  forecast: [
    { day: "Ter", high: 26, low: 14, condition: "☀️" },
    { day: "Qua", high: 25, low: 13, condition: "⛅" },
    { day: "Qui", high: 22, low: 12, condition: "🌧️" },
    { day: "Sex", high: 24, low: 13, condition: "⛅" },
    { day: "Sáb", high: 27, low: 15, condition: "☀️" },
  ],
};

const WeatherWidget = () => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground shadow-lg shadow-primary/20">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-black opacity-80 uppercase tracking-[0.2em] mb-1">Tempo em SJ Lapa</p>
          <p className="text-5xl font-black">{weatherData.temperature}°</p>
          <p className="text-[10px] font-bold opacity-80 mt-1 uppercase tracking-wider">Sensação de {weatherData.feelsLike}°</p>
        </div>
        <motion.div
          animate={{ y: [-2, 2, -2], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud className="h-14 w-14 opacity-90" />
        </motion.div>
      </div>
      <p className="text-sm font-black mb-4 uppercase tracking-widest">{weatherData.condition}</p>
      <div className="flex gap-6 text-[10px] font-bold opacity-80 mb-6 uppercase tracking-wider">
        <span className="flex items-center gap-1.5"><Droplets className="h-4 w-4" /> {weatherData.humidity}%</span>
        <span className="flex items-center gap-1.5"><Wind className="h-4 w-4" /> {weatherData.wind}</span>
      </div>
      <div className="grid grid-cols-5 gap-2 border-t border-white/20 pt-4">
        {weatherData.forecast.map((day) => (
          <div key={day.day} className="text-center">
            <p className="text-[8px] font-black opacity-70 mb-1 uppercase tracking-tighter">{day.day}</p>
            <p className="text-lg mb-1">{day.condition}</p>
            <p className="text-[10px] font-black leading-none">{day.high}°</p>
            <p className="text-[8px] font-bold opacity-60 mt-1 leading-none">{day.low}°</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
