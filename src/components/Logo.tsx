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
        {/* Lowercase b bowl - slightly larger */}
        <motion.path
          d="M20 17C20 17 20 14 27 14C34 14 34 17 34 21C34 25 34 28 27 28C20 28 20 24 20 24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
        />
        {/* Serif - top left of N */}
        <motion.line
          x1="1"
          y1="4"
          x2="7"
          y2="4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
        />
        {/* Serif - bottom left of N */}
        <motion.line
          x1="1"
          y1="28"
          x2="7"
          y2="28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.3 }}
        />
        {/* Serif - top of shared stem */}
        <motion.line
          x1="17"
          y1="4"
          x2="23"
          y2="4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.4 }}
        />
      </svg>
    </motion.a>
  );
};

export default Logo;
