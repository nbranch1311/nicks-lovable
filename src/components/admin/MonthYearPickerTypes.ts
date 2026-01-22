export interface MonthYearValue {
  month: number;
  year: number;
}

export type MonthYearPickerMode = "month-year" | "month-only" | "year-only";

export interface MonthYearPickerProps {
  value?: MonthYearValue;
  defaultValue?: MonthYearValue;
  onChange?: (value: MonthYearValue) => void;
  minYear?: number;
  maxYear?: number;
  minMonth?: number;
  maxMonth?: number;
  disabled?: boolean;
  error?: string;
  className?: string;
  mode?: MonthYearPickerMode;
  placeholder?: string;
  locale?: string;
}

export function monthYearToDate(value: MonthYearValue): Date {
  return new Date(value.year, value.month, 1, 0, 0, 0, 0);
}

export function dateToMonthYear(date: Date): MonthYearValue {
  return {
    month: date.getMonth(),
    year: date.getFullYear(),
  };
}
