"use client"

import { useState, useEffect, useMemo } from "react"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { format, subMonths, subYears, differenceInYears, differenceInMonths, isSameDay, parseISO } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DateRangeSelectorProps {
  onDateRangeChange: (range: { startDate: string; endDate: string }) => void
  startDate?: string
  endDate?: string
}

export function DateRangeSelector({ onDateRangeChange, startDate, endDate }: DateRangeSelectorProps) {
  const displayLabel = useMemo(() => {
    if (!startDate || !endDate) return "Select Range";
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const today = new Date();

    if (isSameDay(end, today)) {
      if (isSameDay(start, subYears(today, 10))) return "10 years";
      if (isSameDay(start, subYears(today, 5))) return "5 years";
      if (isSameDay(start, subMonths(today, 12))) return "1 year"; 
      if (isSameDay(start, subMonths(today, 3))) return "3 months";
      if (isSameDay(start, subMonths(today, 1))) return "1 month";
      if (isSameDay(start, new Date(1990, 0, 1))) return "Max";
    }
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  }, [startDate, endDate]);

  const setRange = (fromDate: Date, label?: string) => {
    const today = new Date()

    onDateRangeChange({
      startDate: format(fromDate, 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    })
  }

  const handleRangeSelection = (option: string) => {
    const today = new Date()

    switch (option) {
      case "1 month":
        setRange(subMonths(today, 1))
        break
      case "3 months":
        setRange(subMonths(today, 3))
        break
      case "1 year":
        setRange(subMonths(today, 12)) 
        break
      case "5 years":
        setRange(subYears(today, 5))
        break
      case "10 years":
        setRange(subYears(today, 10))
        break
      case "max":
        setRange(new Date(1990, 0, 1))
        break
      default:
        setRange(subMonths(today, 3))
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center rounded-full p-2 px-3 bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors">
          <ClockIcon className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">{displayLabel}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuLabel>
            Date Range: {displayLabel}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleRangeSelection("1 month")}>
            1 month
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRangeSelection("3 months")}>
            3 months
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRangeSelection("1 year")}>
            1 year
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRangeSelection("5 years")}>
            5 years
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRangeSelection("10 years")}>
            10 years
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRangeSelection("max")}>
            Max
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
