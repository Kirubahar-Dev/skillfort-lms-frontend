import { motion } from "framer-motion";
import { ReactNode } from "react";

export function AnimatedPage({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="space-y-5"
    >
      {children}
    </motion.div>
  );
}