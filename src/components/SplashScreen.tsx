import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
const mascote = "/mascote.png";

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Show text after mascot appears
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 600);

    // Complete splash screen after text has been shown for a bit
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950"
    >
      <div className="relative flex flex-col items-center">
        {/* Mascot */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100 
          }}
          className="mb-8 w-56 h-56 md:w-72 md:h-72 flex items-center justify-center relative"
        >
          <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />
          <div className="absolute inset-0 bg-cyan-500/10 blur-[40px] rounded-full" />
          <img 
            src={mascote} 
            alt="Mascote Auto Limpeza Pro" 
            className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_20px_rgba(14,165,255,0.4)]"
            onLoad={() => console.log("Mascote loaded successfully")}
            onError={(e) => console.error("Mascote failed to load", e)}
          />
        </motion.div>

        {/* Welcome Text */}
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-sm">
                Seja Bem vindo
              </h1>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl md:text-2xl font-bold text-slate-300">
                  Auto Limpeza
                </span>
                <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-[#0EA5FF] to-[#06B6D4] bg-clip-text text-transparent">
                  Pro
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
