import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type ScrollDownCaretProps = {
  nextSectionId: string;
  ariaLabel?: string;
};

const ScrollDownCaret = ({ nextSectionId, ariaLabel }: ScrollDownCaretProps) => {
  const reduceMotion = useReducedMotion();

  const handleClick = () => {
    const el = document.getElementById(nextSectionId);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel ?? `Scroll to ${nextSectionId}`}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </button>
  );
};

export default ScrollDownCaret;
