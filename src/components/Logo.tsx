import { useState } from "react";
import { motion } from "framer-motion";

type LogoVariant = "geometric" | "stacked" | "connected" | "minimal";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
}

const Logo = ({ variant = "geometric", className = "" }: LogoProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const logos: Record<LogoVariant, JSX.Element> = {
    // Geometric/hexagonal style
    geometric: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <motion.path
          d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        <motion.text
          x="24"
          y="28"
          textAnchor="middle"
          fontSize="14"
          fontFamily="'Playfair Display', serif"
          fontWeight="700"
          fill="currentColor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          NB
        </motion.text>
        <motion.circle
          cx="24"
          cy="4"
          r="3"
          className="fill-primary"
          initial={{ scale: 0 }}
          animate={{ scale: isHovered ? 1.2 : 1 }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    ),

    // Stacked monogram
    stacked: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <motion.rect
          x="8"
          y="8"
          width="32"
          height="32"
          rx="8"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          initial={{ rotate: 0 }}
          animate={{ rotate: isHovered ? 45 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />
        <motion.text
          x="24"
          y="22"
          textAnchor="middle"
          fontSize="11"
          fontFamily="'Playfair Display', serif"
          fontWeight="600"
          fill="currentColor"
          initial={{ y: 22 }}
          animate={{ y: isHovered ? 20 : 22 }}
        >
          N
        </motion.text>
        <motion.text
          x="24"
          y="35"
          textAnchor="middle"
          fontSize="11"
          fontFamily="'Playfair Display', serif"
          fontWeight="600"
          fill="currentColor"
          initial={{ y: 35 }}
          animate={{ y: isHovered ? 37 : 35 }}
        >
          B
        </motion.text>
        <motion.line
          x1="14"
          y1="27"
          x2="34"
          y2="27"
          stroke="currentColor"
          strokeWidth="1"
          className="stroke-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ transformOrigin: "center" }}
        />
      </svg>
    ),

    // Connected letters with line
    connected: (
      <svg
        width="56"
        height="48"
        viewBox="0 0 56 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <motion.path
          d="M8 38V10L18 38V10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d="M28 38V10H38C42 10 45 13 45 18C45 23 42 26 38 26H28M38 26C42 26 46 29 46 34C46 39 42 38 38 38H28"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.circle
          cx="23"
          cy="24"
          r="2"
          className="fill-primary"
          initial={{ scale: 0 }}
          animate={{ scale: isHovered ? [1, 1.5, 1] : 1 }}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
        />
      </svg>
    ),

    // Minimal slash style
    minimal: (
      <svg
        width="64"
        height="48"
        viewBox="0 0 64 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <motion.text
          x="8"
          y="34"
          fontSize="24"
          fontFamily="'Playfair Display', serif"
          fontWeight="700"
          fill="currentColor"
          initial={{ x: 8 }}
          animate={{ x: isHovered ? 4 : 8 }}
          transition={{ duration: 0.3 }}
        >
          N
        </motion.text>
        <motion.line
          x1="30"
          y1="40"
          x2="38"
          y2="8"
          className="stroke-primary"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, rotate: isHovered ? 15 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: "center" }}
        />
        <motion.text
          x="42"
          y="34"
          fontSize="24"
          fontFamily="'Playfair Display', serif"
          fontWeight="700"
          fill="currentColor"
          initial={{ x: 42 }}
          animate={{ x: isHovered ? 46 : 42 }}
          transition={{ duration: 0.3 }}
        >
          B
        </motion.text>
      </svg>
    ),
  };

  return (
    <motion.a
      href="#"
      className="text-foreground hover:text-primary transition-colors cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {logos[variant]}
    </motion.a>
  );
};

export default Logo;
