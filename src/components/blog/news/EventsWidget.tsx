import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";

const events = [
  {
    id: "1",
    title: "Mutirão de Higienização SJ Lapa",
    date: "Sábado, 06/06",
    time: "08:00 – 13:00",
    category: "Empresa",
    attending: 42,
    location: "São José da Lapa - MG",
  },
  {
    id: "2",
    title: "Avaliação Gratuita de Pintura",
    date: "12 de Junho",
    time: "Dia todo",
    category: "Estética Automotiva",
    attending: 78,
    location: "Vespasiano - MG",
  },
  {
    id: "3",
    title: "Live: Mitos sobre Higienização",
    date: "20 de Junho",
    time: "19:30",
    category: "Dicas",
    attending: 160,
    location: "@autolimpezapro",
  },
];

const categoryDot: Record<string, string> = {
  "Higienização": "bg-primary",
  "Estética Automotiva": "bg-accent",
  "Dicas": "bg-amber-500",
  "Empresa": "bg-emerald-500",
};

const EventsWidget = () => {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white">
          <Calendar className="h-4 w-4 text-primary" />
          Próximos Eventos
        </h3>
      </div>
      <div className="space-y-4">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex gap-4 rounded-2xl p-4 transition-all hover:bg-white/[0.08] border border-transparent hover:border-white/5 cursor-pointer"
          >
            <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${categoryDot[event.category] || "bg-primary"}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black leading-tight text-white group-hover:text-primary transition-colors">{event.title}</p>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-wider">{event.date} · {event.time}</p>
              <div className="flex items-center gap-4 mt-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-primary/50" />{event.location}</span>
                <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-primary/50" />{event.attending}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EventsWidget;
