import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <motion.a
      href="#"
      className={`text-foreground hover:text-primary transition-colors cursor-pointer ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        width="44"
        height="32"
        viewBox="0 0 44 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* N left vertical stroke */}
        <motion.line
          x1="4"
          y1="4"
          x2="4"
          y2="28"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        {/* N diagonal stroke */}
        <motion.line
          x1="4"
          y1="4"
          x2="20"
          y2="28"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        />
        {/* Shared vertical stroke (N right + b stem) */}
        <motion.line
          x1="20"
          y1="4"
          x2="20"
          y2="28"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
        />
        {/* Lowercase b bowl - smaller and bottom-aligned */}
        <motion.path
          d="M20 18C20 18 20 15 26 15C32 15 32 18 32 21C32 24 32 28 26 28C20 28 20 25 20 25"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
        />
        {/* Serif accents - top left of N */}
        <motion.line
          x1="2"
          y1="4"
          x2="6"
          y2="4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        />
        {/* Serif accents - bottom left of N */}
        <motion.line
          x1="2"
          y1="28"
          x2="6"
          y2="28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.3 }}
        />
        {/* Serif accents - top of shared stem */}
        <motion.line
          x1="18"
          y1="4"
          x2="22"
          y2="4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.4 }}
        />
      </svg>
    </motion.a>
  );
};

export default Logo;
