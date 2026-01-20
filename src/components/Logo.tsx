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
        width="48"
        height="40"
        viewBox="0 0 48 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* N letter */}
        <motion.path
          d="M4 36V4L14 36V4"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Connecting line from N to b */}
        <motion.line
          x1="14"
          y1="20"
          x2="22"
          y2="20"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
        />
        {/* Lowercase b - stem */}
        <motion.path
          d="M22 4V36"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.7, ease: "easeOut" }}
        />
        {/* Lowercase b - bowl */}
        <motion.path
          d="M22 20C22 20 22 14 30 14C38 14 38 20 38 23C38 26 38 32 30 32C22 32 22 26 22 26"
          stroke="currentColor"
          strokeWidth="3"
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
