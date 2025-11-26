import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: 0.3,
      ease: "easeOut",
    },
  },
};

export function Hero() {
  return (
    <motion.section
      className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-background via-background to-card py-32 px-4"
      data-testid="section-hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,219,88,0.05)_0%,transparent_50%)]" />
      
      <motion.div 
        className="max-w-4xl mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary mb-6 leading-tight"
          data-testid="text-hero-title"
          variants={itemVariants}
        >
          Selamat Datang di{" "}
          <motion.span 
            className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary"
            initial={{ backgroundPosition: "200% center" }}
            animate={{ backgroundPosition: "0% center" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ backgroundSize: "200% 100%" }}
          >
            KynayStreams
          </motion.span>
        </motion.h1>
        
        <motion.p
          className="text-xl sm:text-2xl text-foreground/90 max-w-2xl mx-auto leading-relaxed"
          data-testid="text-hero-subtitle"
          variants={itemVariants}
        >
          Streaming anime terbaru, lengkap, dan update setiap hari.
        </motion.p>

        <motion.div 
          className="mt-8 flex justify-center"
          variants={itemVariants}
        >
          <motion.div 
            className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
            variants={lineVariants}
            style={{ originX: 0.5 }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
