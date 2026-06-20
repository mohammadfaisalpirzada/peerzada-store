import Image from "next/image";
import { motion } from "framer-motion";

export const isAugust = (): boolean => {
  const currentMonth = new Date().getMonth();
  return currentMonth === 7; // August is month 7 (0-indexed)
};

export const PakistanFlag = () => {
  if (!isAugust()) return null;
  
  return (
    <motion.div 
      className="absolute top-2 left-2 z-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative group">
        <Image
          src="/images/flag.png"
          alt="Pakistan Flag - Independence Day"
          width={28}
          height={18}
          className="rounded-md shadow-lg border-2 border-white/30 hover:border-white/50 transition-all duration-300 group-hover:scale-110"
        />
        <motion.div 
          className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Pakistan Independence Day
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
        </div>
      </div>
    </motion.div>
  );
};
