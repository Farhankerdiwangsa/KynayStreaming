import { motion } from "framer-motion";

interface SectionTitleProps {
  children: React.ReactNode;
  align?: "left" | "center";
}

export function SectionTitle({ children, align = "left" }: SectionTitleProps) {
  return (
    <motion.div 
      className={`mb-8 ${align === "center" ? "text-center" : ""}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.h2
        className="text-3xl sm:text-4xl font-bold text-primary mb-3"
        data-testid="text-section-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        {children}
      </motion.h2>
      <motion.div
        className={`h-0.5 w-24 bg-primary rounded-full ${
          align === "center" ? "mx-auto" : ""
        }`}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
        style={{ originX: 0 }}
      />
    </motion.div>
  );
}
