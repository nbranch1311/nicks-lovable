/**
 * MonthYearPicker Component
 *
 * OPEN QUESTIONS (answered):
 *
 * 1. Should the value be stored as a Date or as { month, year }?
 *    → We use { month: number; year: number } for these reasons:
 *      - Cleaner API: no timezone ambiguity, no day normalization needed
 *      - Explicit semantics: a "month-year" picker shouldn't imply a specific day
 *      - Easier validation: just check number ranges
 *      - Simpler serialization for forms/APIs
 *    → We provide toDate() helper for Date conversion when needed
 *
 * 2. How should localization be handled later?
 *    → Month names use Intl.DateTimeFormat with optional locale prop
 *    → TODO: Accept locale prop and pass to formatter
 *    → TODO: Consider react-intl or i18next integration
 *
 * 3. Should this support range selection in the future?
 *    → Current architecture allows extension via mode prop
 *    → TODO: Add "range" mode with { start: MonthYearValue; end: MonthYearValue }
 */

import * as React from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/** Represents a month-year value without a specific day */
export interface MonthYearValue {
  month: number; // 0-11 (JavaScript Date convention)
  year: number;
}

/** Picker mode determines which selectors are shown */
export type MonthYearPickerMode = "month-year" | "month-only" | "year-only";

/** View state for internal navigation */
type PickerView = "months" | "years";

export interface MonthYearPickerProps {
  /** Controlled value */
  value?: MonthYearValue;
  /** Default value for uncontrolled usage */
  defaultValue?: MonthYearValue;
  /** Callback when value changes */
  onChange?: (value: MonthYearValue) => void;
  /** Minimum selectable year */
  minYear?: number;
  /** Maximum selectable year */
  maxYear?: number;
  /** Minimum selectable month (only applies when year equals minYear) */
  minMonth?: number;
  /** Maximum selectable month (only applies when year equals maxYear) */
  maxMonth?: number;
  /** Disable the picker */
  disabled?: boolean;
  /** Error message for form validation */
  error?: string;
  /** Additional CSS classes */
  className?: string;
  /** Picker mode */
  mode?: MonthYearPickerMode;
  /** Placeholder text */
  placeholder?: string;
  /** Locale for month names (default: browser locale) */
  locale?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate an array of years between min and max (inclusive)
 */
function generateYearRange(minYear: number, maxYear: number): number[] {
  const years: number[] = [];
  for (let year = minYear; year <= maxYear; year++) {
    years.push(year);
  }
  return years;
}

/**
 * Get localized month names
 */
function getMonthNames(locale?: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: "long" });
  return Array.from({ length: 12 }, (_, i) =>
    formatter.format(new Date(2000, i, 1))
  );
}

/**
 * Get short month names for compact display
 */
function getShortMonthNames(locale?: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: "short" });
  return Array.from({ length: 12 }, (_, i) =>
    formatter.format(new Date(2000, i, 1))
  );
}

/**
 * Format a MonthYearValue for display
 */
function formatMonthYear(
  value: MonthYearValue,
  mode: MonthYearPickerMode,
  locale?: string
): string {
  const monthNames = getMonthNames(locale);

  switch (mode) {
    case "month-only":
      return monthNames[value.month];
    case "year-only":
      return String(value.year);
    case "month-year":
    default:
      return `${monthNames[value.month]} ${value.year}`;
  }
}

/**
 * Convert MonthYearValue to Date (first day of month at midnight UTC)
 */
export function monthYearToDate(value: MonthYearValue): Date {
  return new Date(value.year, value.month, 1, 0, 0, 0, 0);
}

/**
 * Convert Date to MonthYearValue
 */
export function dateToMonthYear(date: Date): MonthYearValue {
  return {
    month: date.getMonth(),
    year: date.getFullYear(),
  };
}

/**
 * Check if a month is disabled based on constraints
 */
function isMonthDisabled(
  month: number,
  year: number,
  minYear: number,
  maxYear: number,
  minMonth?: number,
  maxMonth?: number
): boolean {
  if (year < minYear || year > maxYear) return true;
  if (year === minYear && minMonth !== undefined && month < minMonth) return true;
  if (year === maxYear && maxMonth !== undefined && month > maxMonth) return true;
  return false;
}

/**
 * Get the current value, preferring controlled over uncontrolled
 */
function useControllableValue(
  value: MonthYearValue | undefined,
  defaultValue: MonthYearValue | undefined,
  onChange: ((value: MonthYearValue) => void) | undefined
): [MonthYearValue, (newValue: MonthYearValue) => void] {
  const now = new Date();
  const fallbackValue: MonthYearValue = {
    month: now.getMonth(),
    year: now.getFullYear(),
  };

  const [internalValue, setInternalValue] = React.useState<MonthYearValue>(
    defaultValue ?? fallbackValue
  );

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (newValue: MonthYearValue) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );

  return [currentValue, setValue];
}

// ============================================================================
// COMPONENT
// ============================================================================

const MonthYearPicker = React.forwardRef<HTMLButtonElement, MonthYearPickerProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      minYear = 1900,
      maxYear = 2100,
      minMonth,
      maxMonth,
      disabled = false,
      error,
      className,
      mode = "month-year",
      placeholder = "Select date",
      locale,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [currentValue, setCurrentValue] = useControllableValue(
      value,
      defaultValue,
      onChange
    );

    // View state for navigation
    const [view, setView] = React.useState<PickerView>(
      mode === "year-only" ? "years" : "months"
    );
    
    // Year being viewed in month grid (for navigation)
    const [viewYear, setViewYear] = React.useState(currentValue.year);

    // Reset view when picker opens
    React.useEffect(() => {
      if (open) {
        setView(mode === "year-only" ? "years" : "months");
        setViewYear(currentValue.year);
      }
    }, [open, mode, currentValue.year]);

    const years = React.useMemo(
      () => generateYearRange(minYear, maxYear),
      [minYear, maxYear]
    );

    const monthNames = React.useMemo(() => getMonthNames(locale), [locale]);
    const shortMonthNames = React.useMemo(() => getShortMonthNames(locale), [locale]);

    const handleMonthSelect = (month: number) => {
      const newValue = { month, year: viewYear };
      setCurrentValue(newValue);
      
      if (mode === "month-only" || mode === "month-year") {
        setOpen(false);
      }
    };

    const handleYearSelect = (year: number) => {
      setViewYear(year);
      
      if (mode === "year-only") {
        setCurrentValue({ ...currentValue, year });
        setOpen(false);
      } else {
        // Switch to month view after selecting year
        setView("months");
      }
    };

    const handlePrevYear = () => {
      if (viewYear > minYear) {
        setViewYear(viewYear - 1);
      }
    };

    const handleNextYear = () => {
      if (viewYear < maxYear) {
        setViewYear(viewYear + 1);
      }
    };

    const displayValue = currentValue
      ? formatMonthYear(currentValue, mode, locale)
      : null;

    return (
      <div className={cn("relative", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select month and year"
              aria-invalid={!!error}
              disabled={disabled}
              className={cn(
                "w-full justify-start text-left font-normal",
                !displayValue && "text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {displayValue ?? placeholder}
            </Button>
          </PopoverTrigger>

          <PopoverContent 
            className="w-auto p-0 pointer-events-auto" 
            align="start"
            sideOffset={4}
          >
            <div className="p-3">
              {/* Header with year navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handlePrevYear}
                  disabled={viewYear <= minYear}
                  aria-label="Previous year"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  className="font-semibold"
                  onClick={() => setView(view === "years" ? "months" : "years")}
                  aria-label={view === "years" ? "Show months" : "Show years"}
                >
                  {view === "years" ? "Select Year" : viewYear}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleNextYear}
                  disabled={viewYear >= maxYear}
                  aria-label="Next year"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Month Grid */}
              {view === "months" && mode !== "year-only" && (
                <div
                  className="grid grid-cols-3 gap-2"
                  role="grid"
                  aria-label="Month selection"
                >
                  {monthNames.map((name, index) => {
                    const isDisabled = isMonthDisabled(
                      index,
                      viewYear,
                      minYear,
                      maxYear,
                      minMonth,
                      maxMonth
                    );
                    const isSelected =
                      currentValue.month === index &&
                      currentValue.year === viewYear;

                    return (
                      <Button
                        key={index}
                        variant={isSelected ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "h-9",
                          isSelected && "bg-primary text-primary-foreground",
                          isDisabled && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={isDisabled}
                        onClick={() => handleMonthSelect(index)}
                        aria-label={`${name} ${viewYear}`}
                        aria-selected={isSelected}
                        role="gridcell"
                      >
                        {shortMonthNames[index]}
                      </Button>
                    );
                  })}
                </div>
              )}

              {/* Year Grid */}
              {(view === "years" || mode === "year-only") && (
                <YearGrid
                  years={years}
                  selectedYear={currentValue.year}
                  viewYear={viewYear}
                  onSelect={handleYearSelect}
                />
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Error message */}
        {error && (
          <p className="text-sm text-destructive mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

MonthYearPicker.displayName = "MonthYearPicker";

// ============================================================================
// YEAR GRID SUB-COMPONENT
// ============================================================================

interface YearGridProps {
  years: number[];
  selectedYear: number;
  viewYear: number;
  onSelect: (year: number) => void;
}

function YearGrid({ years, selectedYear, viewYear, onSelect }: YearGridProps) {
  const gridRef = React.useRef<HTMLDivElement>(null);

  // Scroll to selected year on mount
  React.useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const selectedButton = grid.querySelector('[aria-selected="true"]');
    if (selectedButton) {
      selectedButton.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }, []);

  // Show years in chunks around viewYear for better UX
  const startYear = Math.max(years[0], viewYear - 6);
  const endYear = Math.min(years[years.length - 1], viewYear + 5);
  const visibleYears = years.filter((y) => y >= startYear && y <= endYear);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto"
      role="grid"
      aria-label="Year selection"
    >
      {visibleYears.map((year) => {
        const isSelected = selectedYear === year;

        return (
          <Button
            key={year}
            variant={isSelected ? "default" : "ghost"}
            size="sm"
            className={cn(
              "h-9",
              isSelected && "bg-primary text-primary-foreground"
            )}
            onClick={() => onSelect(year)}
            aria-label={String(year)}
            aria-selected={isSelected}
            role="gridcell"
          >
            {year}
          </Button>
        );
      })}
    </div>
  );
}

export { MonthYearPicker };

// ============================================================================
// USAGE EXAMPLES (for documentation)
// ============================================================================

/**
 * EXAMPLE 1: Basic controlled usage
 *
 * ```tsx
 * const [value, setValue] = useState<MonthYearValue>({ month: 0, year: 2024 });
 *
 * <MonthYearPicker
 *   value={value}
 *   onChange={setValue}
 *   minYear={2020}
 *   maxYear={2030}
 * />
 * ```
 *
 * EXAMPLE 2: React Hook Form integration
 *
 * ```tsx
 * import { useForm, Controller } from "react-hook-form";
 * import { MonthYearPicker, MonthYearValue } from "@/components/ui/month-year-picker";
 *
 * interface FormData {
 *   startDate: MonthYearValue;
 * }
 *
 * function MyForm() {
 *   const { control, handleSubmit } = useForm<FormData>();
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <Controller
 *         name="startDate"
 *         control={control}
 *         rules={{ required: "Start date is required" }}
 *         render={({ field, fieldState }) => (
 *           <MonthYearPicker
 *             value={field.value}
 *             onChange={field.onChange}
 *             error={fieldState.error?.message}
 *           />
 *         )}
 *       />
 *     </form>
 *   );
 * }
 * ```
 *
 * EXAMPLE 3: Year-only mode
 *
 * ```tsx
 * <MonthYearPicker
 *   mode="year-only"
 *   minYear={1950}
 *   maxYear={new Date().getFullYear()}
 *   placeholder="Select birth year"
 * />
 * ```
 */
