import { ThemeColors } from "./types";

// Border radius mapping
export function getBorderRadius(radius: ThemeColors["borderRadius"]): string {
  const radiusMap = {
    none: "0",
    sm: "8px",
    md: "16px",
    lg: "20px",
    full: "24px",
  };
  return radiusMap[radius];
}

// Button border radius mapping
export function getButtonRadius(radius: ThemeColors["borderRadius"]): string {
  const radiusMap = {
    none: "0",
    sm: "8px",
    md: "12px",
    lg: "16px",
    full: "9999px",
  };
  return radiusMap[radius];
}

// Get button styles based on theme
export function getButtonStyles(colors: ThemeColors, variant: "primary" | "secondary" | "outline" = "primary") {
  const baseRadius = getButtonRadius(colors.borderRadius);

  if (variant === "primary") {
    return {
      backgroundColor: colors.buttonStyle === "solid" ? colors.primaryColor : "transparent",
      color: colors.buttonStyle === "solid" ? "#fff" : colors.primaryColor,
      border: colors.buttonStyle === "outline" ? `2px solid ${colors.primaryColor}` : "none",
      borderRadius: baseRadius,
    };
  }

  if (variant === "secondary") {
    return {
      backgroundColor: colors.buttonStyle === "solid" ? colors.secondaryColor : "transparent",
      color: colors.buttonStyle === "solid" ? "#fff" : colors.secondaryColor,
      border: colors.buttonStyle === "outline" ? `2px solid ${colors.secondaryColor}` : "none",
      borderRadius: baseRadius,
    };
  }

  return {
    backgroundColor: "transparent",
    color: colors.primaryColor,
    border: `2px solid ${colors.primaryColor}`,
    borderRadius: baseRadius,
  };
}

// Get card styles
export function getCardStyles(colors: ThemeColors) {
  return {
    borderRadius: getBorderRadius(colors.borderRadius),
    backgroundColor: colors.backgroundColor,
    border: `1px solid ${colors.primaryColor}15`,
  };
}

// Helper to extract YouTube video ID
export function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Smooth scroll to element
export function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
