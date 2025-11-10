"use client";

import { motion } from "framer-motion";

interface AnimatedHeartProps {
  size?: number;
}

export default function AnimatedHeart({ size = 60 }: AnimatedHeartProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        filter: [
          "drop-shadow(0 0 0px rgba(255,0,80,0))",
          "drop-shadow(0 0 15px rgba(255,0,80,0.9))",
          "drop-shadow(0 0 0px rgba(255,0,80,0))",
        ],
      }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="text-pink-500"
      style={{
        fontSize: `${size}px`,
        lineHeight: 1,
      }}
    >
      ❤️
    </motion.div>
  );
}
