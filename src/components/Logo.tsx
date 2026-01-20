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
        width="56"
        height="32"
        viewBox="0 0 56 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* N letter - elegant serif style */}
        <motion.path
          d="M4 28V4L16 28V4"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Connecting line from N to b */}
        <motion.line
          x1="16"
          y1="16"
          x2="24"
          y2="16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
        />
        {/* Lowercase b - stem */}
        <motion.path
          d="M24 4V28"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.7, ease: "easeOut" }}
        />
        {/* Lowercase b - bowl */}
        <motion.path
          d="M24 16C24 16 24 11 32 11C40 11 40 16 40 19C40 22 40 27 32 27C24 27 24 22 24 22"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
        />
      </svg>
    </motion.a>
  );
};

export default Logo;
