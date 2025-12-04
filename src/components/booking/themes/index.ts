// Theme registry - maps layout template to theme component
import { LuxuryTheme } from "./luxury";
import { ClassicTheme } from "./classic";
import { ModernTheme } from "./modern";
import { MinimalTheme } from "./minimal";
import { PortfolioTheme } from "./portfolio";
import { ChristmasTheme } from "./christmas";
import { StarterTheme } from "./starter";
import { BlossomTheme } from "./blossom";
import { GridTheme } from "./grid";
import { ThemeComponentProps } from "./types";

export type ThemeComponent = React.ComponentType<ThemeComponentProps>;

export const THEME_REGISTRY: Record<string, ThemeComponent> = {
  luxury: LuxuryTheme,
  classic: ClassicTheme,
  modern: ModernTheme,
  minimal: MinimalTheme,
  portfolio: PortfolioTheme,
  christmas: ChristmasTheme,
  starter: StarterTheme,
  blossom: BlossomTheme,
  grid: GridTheme,
};

// Get theme component, fallback to Classic if not found
export function getThemeComponent(layoutTemplate: string): ThemeComponent {
  const theme = THEME_REGISTRY[layoutTemplate];

  if (!theme) {
    console.warn(`Theme "${layoutTemplate}" not found, falling back to Classic theme`);
    return ClassicTheme;
  }

  return theme;
}

// Re-export types
export * from "./types";
