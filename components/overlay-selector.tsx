"use client"

import { useState } from "react"
import { LayersIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"

export interface OverlayOptions {
  showRecessions: boolean;
  showNasdaq: boolean;
}

interface OverlaySelectorProps {
  defaultOptions?: OverlayOptions;
  onOverlayChange: (options: OverlayOptions) => void;
}

export function OverlaySelector({ 
  defaultOptions = { showRecessions: true, showNasdaq: false }, 
  onOverlayChange 
}: OverlaySelectorProps) {
  const [options, setOptions] = useState<OverlayOptions>(defaultOptions);

  const handleToggleOverlay = (optionKey: keyof OverlayOptions) => {
    const newOptions = { 
      ...options, 
      [optionKey]: !options[optionKey] 
    };
    
    setOptions(newOptions);
    onOverlayChange(newOptions);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center rounded-full p-2 px-3 bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90 transition-colors">
        <LayersIcon className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">Overlays</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto">
        <DropdownMenuLabel>
          Chart Overlays
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={options.showRecessions}
          onCheckedChange={() => handleToggleOverlay('showRecessions')}
        >
          Recessions
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={options.showNasdaq}
          onCheckedChange={() => handleToggleOverlay('showNasdaq')}
        >
          NASDAQ Index
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
