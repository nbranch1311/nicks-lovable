import { useState, useRef, useEffect } from "react";
import { format, parse, isValid, startOfMonth } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
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

const MonthYearPicker = ({
  value,
  onChange,
  disabled = false,
  placeholder = "MMM YYYY",
}: MonthYearPickerProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value and selected date with prop
  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        if (isValid(date)) {
          setInputValue(format(date, "MMM yyyy"));
          setSelectedDate(startOfMonth(date));
        }
      } catch {
        setInputValue("");
        setSelectedDate(undefined);
      }
    } else {
      setInputValue("");
      setSelectedDate(undefined);
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

  const handleMonthSelect = (date: Date | undefined) => {
    if (date) {
      const monthStart = startOfMonth(date);
      onChange(format(monthStart, "yyyy-MM-dd"));
      setOpen(false);
    }
  };

  const startMonth = new Date(1990, 0);
  const endMonth = new Date();

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
        <PopoverContent className="w-auto p-0" align="start">
          <div className="pointer-events-auto">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleMonthSelect}
              defaultMonth={selectedDate}
              disabled={(date) => date > new Date()}
              captionLayout="dropdown"
              startMonth={startMonth}
              endMonth={endMonth}
              autoFocus
            />
            {/* Quick actions */}
            <div className="flex gap-2 px-3 pb-3 border-t border-border">
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
