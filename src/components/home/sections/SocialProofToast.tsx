import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SOCIAL_PROOFS } from "@/config/home-data";

interface SocialProofToastProps {
  variants: any;
}

export function SocialProofToast({ variants }: SocialProofToastProps) {
  const [toastText, setToastText] = useState(SOCIAL_PROOFS[0]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % SOCIAL_PROOFS.length;
      setToastText(SOCIAL_PROOFS[i]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section variants={variants} className="px-5 pt-6">
      <div className="bg-card/50 border border-white/10 rounded-full py-2.5 px-6 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-success" />
        <p className="text-[11px] font-bold text-success/90 uppercase tracking-wide">{toastText}</p>
      </div>
    </motion.section>
  );
}
