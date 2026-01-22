import { useState, useRef, useEffect } from "react";
import { format, parse, isValid, startOfMonth } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MonthYearPickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MonthYearPicker = ({
  value,
  onChange,
  disabled = false,
  placeholder = "MMM YYYY",
}: MonthYearPickerProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Sync input value and selected date with prop
  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        if (isValid(date)) {
          setInputValue(format(date, "MMM yyyy"));
          setSelectedMonth(date.getMonth());
          setSelectedYear(date.getFullYear());
          setViewYear(date.getFullYear());
        }
      } catch {
        setInputValue("");
        setSelectedMonth(null);
        setSelectedYear(null);
      }
    } else {
      setInputValue("");
      setSelectedMonth(null);
      setSelectedYear(null);
    }
  }, [value]);

  const parseInput = (input: string): Date | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    const formats = [
      "MMM yyyy",
      "MMMM yyyy",
      "MM/yyyy",
      "M/yyyy",
      "yyyy-MM",
    ];

    for (const fmt of formats) {
      try {
        const parsed = parse(trimmed, fmt, new Date());
        if (isValid(parsed)) {
          return startOfMonth(parsed);
        }
      } catch {
        // Continue to next format
      }
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const parsed = parseInput(inputValue);
    if (parsed) {
      onChange(format(parsed, "yyyy-MM-dd"));
      setInputValue(format(parsed, "MMM yyyy"));
    } else if (inputValue.trim() === "") {
      onChange(null);
    } else {
      if (value) {
        const date = new Date(value);
        if (isValid(date)) {
          setInputValue(format(date, "MMM yyyy"));
        }
      } else {
        setInputValue("");
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInputBlur();
      inputRef.current?.blur();
    }
  };

  const handleMonthClick = (monthIndex: number) => {
    // Don't allow future months
    if (viewYear === currentYear && monthIndex > currentMonth) {
      return;
    }
    
    const date = new Date(viewYear, monthIndex, 1);
    onChange(format(date, "yyyy-MM-dd"));
    setOpen(false);
  };

  const isMonthDisabled = (monthIndex: number) => {
    return viewYear === currentYear && monthIndex > currentMonth;
  };

  const isMonthSelected = (monthIndex: number) => {
    return selectedYear === viewYear && selectedMonth === monthIndex;
  };

  return (
    <div className="relative flex">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "pr-10",
          !inputValue && "text-muted-foreground"
        )}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={disabled}
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            type="button"
          >
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="p-3 pointer-events-auto">
            {/* Year Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewYear(y => y - 1)}
                disabled={viewYear <= 1990}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-semibold">{viewYear}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewYear(y => y + 1)}
                disabled={viewYear >= currentYear}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((month, index) => (
                <Button
                  key={month}
                  variant={isMonthSelected(index) ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-9",
                    isMonthDisabled(index) && "opacity-50 cursor-not-allowed",
                    isMonthSelected(index) && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleMonthClick(index)}
                  disabled={isMonthDisabled(index)}
                >
                  {month}
                </Button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  const today = startOfMonth(new Date());
                  onChange(format(today, "yyyy-MM-dd"));
                  setOpen(false);
                }}
              >
                This Month
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-xs text-muted-foreground"
                onClick={() => {
                  onChange(null);
                  setInputValue("");
                  setOpen(false);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MonthYearPicker;
