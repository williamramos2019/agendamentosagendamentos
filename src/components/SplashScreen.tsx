import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Show text after mascot appears
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1200);

    // Complete splash screen after text has been shown for a bit
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-slate-900"
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
          className="mb-6 w-48 h-48 md:w-64 md:h-64"
        >
          <img 
            src="/src/assets/mascote-auto-limpeza-pro.png" 
            alt="Mascote Auto Limpeza Pro" 
            className="w-full h-full object-contain"
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
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                Seja Bem vindo
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Auto Limpeza Pro
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
