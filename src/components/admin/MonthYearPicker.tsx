import { useState, useRef, useEffect } from "react";
import { format, parse, isValid, setMonth, setYear, startOfMonth } from "date-fns";
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
  const [mode, setMode] = useState<"month" | "year">("month");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value with prop
  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        if (isValid(date)) {
          setInputValue(format(date, "MMM yyyy"));
          setViewYear(date.getFullYear());
        }
      } catch {
        setInputValue("");
      }
    } else {
      setInputValue("");
    }
  }, [value]);

  const parseInput = (input: string): Date | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Try various formats
    const formats = [
      "MMM yyyy",   // Jan 2024
      "MMMM yyyy",  // January 2024
      "MM/yyyy",    // 01/2024
      "M/yyyy",     // 1/2024
      "yyyy-MM",    // 2024-01
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
      onChange(parsed.toISOString().split("T")[0]);
      setInputValue(format(parsed, "MMM yyyy"));
      setViewYear(parsed.getFullYear());
    } else if (inputValue.trim() === "") {
      onChange(null);
    } else {
      // Reset to previous valid value
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

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = startOfMonth(setMonth(setYear(new Date(), viewYear), monthIndex));
    onChange(newDate.toISOString().split("T")[0]);
    setOpen(false);
  };

  const handleYearSelect = (year: number) => {
    setViewYear(year);
    setMode("month");
  };

  const selectedDate = value ? new Date(value) : null;
  const selectedMonth = selectedDate?.getMonth();
  const selectedYear = selectedDate?.getFullYear();

  // Generate year range for year picker
  const currentYear = new Date().getFullYear();
  const startYear = Math.floor(viewYear / 12) * 12;
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

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
            {/* Header with navigation */}
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  if (mode === "month") {
                    setViewYear((y) => y - 1);
                  } else {
                    setViewYear((y) => y - 12);
                  }
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="font-medium"
                onClick={() => setMode(mode === "month" ? "year" : "month")}
              >
                {mode === "month" ? viewYear : `${startYear} - ${startYear + 11}`}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => {
                  if (mode === "month") {
                    setViewYear((y) => y + 1);
                  } else {
                    setViewYear((y) => y + 12);
                  }
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Month or Year grid */}
            {mode === "month" ? (
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((month, index) => {
                  const isSelected = selectedMonth === index && selectedYear === viewYear;
                  const isFuture = viewYear > currentYear || 
                    (viewYear === currentYear && index > new Date().getMonth());
                  
                  return (
                    <Button
                      key={month}
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "h-9",
                        isSelected && "bg-primary text-primary-foreground",
                        isFuture && "text-muted-foreground/50"
                      )}
                      onClick={() => handleMonthSelect(index)}
                    >
                      {month}
                    </Button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {years.map((year) => {
                  const isSelected = selectedYear === year;
                  const isFuture = year > currentYear;
                  
                  return (
                    <Button
                      key={year}
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "h-9",
                        isSelected && "bg-primary text-primary-foreground",
                        isFuture && "text-muted-foreground/50"
                      )}
                      onClick={() => handleYearSelect(year)}
                    >
                      {year}
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Quick actions */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  const today = startOfMonth(new Date());
                  onChange(today.toISOString().split("T")[0]);
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
