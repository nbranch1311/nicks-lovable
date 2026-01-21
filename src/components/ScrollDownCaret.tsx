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
      className="absolute bottom-8 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-transparent border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted/20 transition-all"
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </button>
  );
};

export default ScrollDownCaret;
