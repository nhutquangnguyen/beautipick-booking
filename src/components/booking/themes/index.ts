// Theme registry - maps layout template to theme component
import { ChristmasTheme } from "./christmas";
import { StarterTheme } from "./starter";
import { EleganceGridTheme } from "./elegancegrid";
import { ShowcaseGridTheme } from "./showcasegrid";
import { ThemeComponentProps } from "./types";

export type ThemeComponent = React.ComponentType<ThemeComponentProps>;

export const THEME_REGISTRY: Record<string, ThemeComponent> = {
  christmas: ChristmasTheme,
  starter: StarterTheme,
  elegancegrid: EleganceGridTheme,
  showcasegrid: ShowcaseGridTheme,
};

// Get theme component, fallback to Starter if not found
export function getThemeComponent(layoutTemplate: string): ThemeComponent {
  const theme = THEME_REGISTRY[layoutTemplate];

  if (!theme) {
    console.warn(`Theme "${layoutTemplate}" not found, falling back to Starter theme`);
    return StarterTheme;
  }

  return theme;
}

// Re-export types
export * from "./types";
