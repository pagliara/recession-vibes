"use client"

import { Label, YAxisProps, XAxisProps } from 'recharts'

/**
 * Creates configuration for a responsive Y-axis with consistent styling
 * On mobile (<640px), axis is positioned on the right with no label
 * On larger screens, axis is positioned on the left with a label
 */
export function createResponsiveYAxis({
  axisLabel,
  isMobile,
  mobileWidth = 30,
  desktopWidth = 100, // Increased width to accommodate labels
  mobileTickCount = 5,
  desktopTickCount = 7,
  mobileFontSize = 10,
  desktopFontSize = 12,
  labelOffset = 20, // Increased offset to prevent clipping
  tickLine,
  axisLine,
  domain = ['auto', 'auto'],
  orientation,
  width,
  tick,
  tickCount,
  padding = { top: 30, bottom: 30 },
  ...props
}: {
  axisLabel?: string;
  isMobile: boolean;
  mobileWidth?: number;
  desktopWidth?: number;
  mobileTickCount?: number;
  desktopTickCount?: number;
  mobileFontSize?: number;
  desktopFontSize?: number;
  labelOffset?: number;
} & YAxisProps) {
  // Use provided values or responsive defaults
  const finalOrientation = orientation || (isMobile ? "right" : "left");
  const finalWidth = width || (isMobile ? mobileWidth : desktopWidth);
  const finalTickCount = tickCount || (isMobile ? mobileTickCount : desktopTickCount);
  const finalTick = tick || { fontSize: isMobile ? mobileFontSize : desktopFontSize };

  // Prepare the label if needed
  const labelProps = !isMobile && axisLabel ? {
    label: {
      value: axisLabel,
      angle: -90,
      position: "insideLeft",
      style: { textAnchor: 'middle', fill: 'var(--muted-foreground)', fontSize: '12px' },
      className: "text-xs fill-muted-foreground",
      offset: labelOffset,
    }
  } : {};
  
  // Return the axis configuration
  return {
    domain,
    tickLine: tickLine ?? true, // Use passed value or default to true
    axisLine: axisLine ?? true, // Use passed value or default to true
    stroke: "#000000", // Black color for the axis line
    tickSize: 5,        // Length of tick marks
    tickMargin: 5,      // Margin between tick and label
    orientation: finalOrientation,
    width: finalWidth,
    tickCount: finalTickCount,
    tick: finalTick,
    ...labelProps,
    ...props
  };
}

/**
 * Creates configuration for a responsive X-axis with consistent styling
 */
export function createResponsiveXAxis({
  isMobile,
  mobileHeight = 35,
  desktopHeight = 50,
  mobileFontSize = 10,
  desktopFontSize = 12,
  padding = { left: 10, right: 10 },
  tickLine,
  axisLine,
  allowDataOverflow = true,
  height,
  tick,
  ...props
}: {
  isMobile: boolean;
  mobileHeight?: number;
  desktopHeight?: number;
  mobileFontSize?: number;
  desktopFontSize?: number;
  padding?: { left: number, right: number };
} & XAxisProps) {
  // Use provided values or responsive defaults
  const finalHeight = height || (isMobile ? mobileHeight : desktopHeight);
  const finalTick = tick || { fontSize: isMobile ? mobileFontSize : desktopFontSize };
  
  // Return the axis configuration
  return {
    tickLine: tickLine ?? true, // Use passed value or default to true
    axisLine: axisLine ?? true, // Use passed value or default to true
    stroke: "#000000", // Black color for the axis line
    tickSize: 5,       // Length of tick marks
    tickMargin: 5,     // Margin between tick and label
    allowDataOverflow,
    padding,
    tick: finalTick,
    height: finalHeight,
    ...props
  };
}
