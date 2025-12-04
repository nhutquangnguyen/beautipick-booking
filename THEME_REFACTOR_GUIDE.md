# Theme System Refactor Guide

## Overview

The booking page has been refactored from a **monolithic 2000-line file** with hardcoded UI to a **flexible component-based theme system** where each theme owns its complete structure.

---

## Architecture

### Before (Problems)
```
booking-page.tsx (2,018 lines)
├─ All business logic + UI rendering mixed
├─ if (theme === "luxury") { customHTML } else { defaultHTML }
├─ Only colors/fonts were dynamic
└─ Adding new themes required editing massive file
```

### After (Solution)
```
booking-page-refactored.tsx (100 lines)
├─ Data fetching + cart logic ONLY
├─ Passes data to theme components
└─ Themes own their complete structure

themes/
├─ types.ts                    # Shared interfaces
├─ utils.ts                    # Helper functions
├─ shared/                     # Shared components
│   ├─ SocialIcons.tsx
│   └─ SocialConfig.ts
├─ luxury/                     # Luxury theme
│   ├─ index.tsx              # Main component
│   ├─ HeroSection.tsx
│   ├─ AboutSection.tsx
│   ├─ ServicesSection.tsx
│   ├─ ProductsSection.tsx
│   ├─ GallerySection.tsx
│   ├─ ContactSection.tsx
│   ├─ SocialSection.tsx
│   └─ VideoSection.tsx
├─ classic/                    # Classic theme
│   └─ ... (same structure)
└─ index.ts                    # Theme registry
```

---

## How It Works

### 1. Theme Registry

```typescript
// themes/index.ts
const THEME_REGISTRY = {
  luxury: LuxuryTheme,
  classic: ClassicTheme,
  // Add more themes here
};

function getThemeComponent(layoutTemplate: string) {
  return THEME_REGISTRY[layoutTemplate] || ClassicTheme;
}
```

### 2. Data Contract

Every theme receives the same props:

```typescript
interface ThemeComponentProps {
  data: ThemeData;           // Merchant info, services, products, etc.
  colors: ThemeColors;       // Primary, secondary, fonts, etc.
  cart: ThemeCartHandlers;   // Cart functions
  locale: string;
  currency: string;
  onOpenCart: () => void;
}
```

### 3. Theme Implementation

Each theme is **completely independent**:

```typescript
// themes/luxury/index.tsx
export function LuxuryTheme({ data, colors, cart }: ThemeComponentProps) {
  return (
    <div className="luxury-layout">
      <LuxuryHeroSection merchant={data.merchant} colors={colors} />
      <LuxuryAboutSection merchant={data.merchant} colors={colors} />
      <LuxuryServicesSection
        services={data.services}
        colors={colors}
        cart={cart}
      />
      {/* Complete freedom of structure */}
    </div>
  );
}

// themes/classic/index.tsx
export function ClassicTheme({ data, colors, cart }: ThemeComponentProps) {
  return (
    <div className="classic-layout">
      {/* Completely different structure */}
      <ClassicHeroSection merchant={data.merchant} colors={colors} />
      <ClassicAboutSection merchant={data.merchant} colors={colors} />
      {/* Different components, different layout */}
    </div>
  );
}
```

---

## Key Benefits

### ✅ True Flexibility
- Each theme controls its own HTML structure
- No `if (theme === "luxury")` conditionals
- Can use completely different component architectures

### ✅ Separation of Concerns
```
booking-page-refactored.tsx   → Data + Cart logic
themes/luxury/                → Luxury UI structure
themes/classic/               → Classic UI structure
```

### ✅ Easy to Extend

**Adding a new theme:**
1. Create `themes/modern/` folder
2. Implement sections using `ThemeComponentProps`
3. Add to registry: `THEME_REGISTRY.modern = ModernTheme`

**That's it!** No need to touch booking-page.tsx or other themes.

### ✅ Maintainability
- Each theme file: ~200-300 lines (was 2000+)
- Clear file structure
- Easy to test individual themes

---

## Theme Comparison

### Luxury Theme
```typescript
// Full-screen parallax hero
<LuxuryHeroSection>
  - Cover image background
  - Centered logo + title
  - Gold accents
  - Parallax scrolling
</LuxuryHeroSection>

// Glass morphism containers
<LuxuryServicesSection>
  - Frosted glass backgrounds
  - Premium shadows
  - Gold shimmer effects
</LuxuryServicesSection>
```

### Classic Theme
```typescript
// Stacked traditional hero
<ClassicHeroSection>
  - Square logo
  - Decorative lines
  - Serif fonts
  - Centered symmetrical layout
</ClassicHeroSection>

// Menu-style services
<ClassicServicesSection>
  - List layout with borders
  - Traditional spacing
  - Simple hover effects
</ClassicServicesSection>
```

---

## Usage

### For Merchants

**1. Select theme in dashboard:**
```typescript
// Design settings
const theme = {
  layoutTemplate: "luxury",  // or "classic"
  primaryColor: "#D4AF37",   // Gold
  secondaryColor: "#0A0A0A", // Black
  fontFamily: "Playfair Display",
  // ... other color settings
};
```

**2. Theme renders automatically:**
```typescript
// Booking page automatically uses the right theme
<BookingPageRefactored theme={theme} merchant={...} />
  ↓
<LuxuryTheme data={...} colors={...} cart={...} />
  ↓
<div className="luxury-layout">
  {/* Luxury-specific structure */}
</div>
```

### For Developers

**Creating a new theme:**

```typescript
// 1. Create themes/modern/index.tsx
export function ModernTheme({ data, colors, cart }: ThemeComponentProps) {
  return (
    <div className="modern-layout">
      <ModernHeroSection merchant={data.merchant} colors={colors} />
      <ModernServicesSection
        services={data.services}
        colors={colors}
        cart={cart}
      />
      {/* Your custom structure */}
    </div>
  );
}

// 2. Create individual sections
// themes/modern/HeroSection.tsx
export function ModernHeroSection({ merchant, colors }: HeroSectionProps) {
  return (
    <section style={{ backgroundColor: colors.primaryColor }}>
      {/* Your custom hero design */}
    </section>
  );
}

// 3. Register theme
// themes/index.ts
import { ModernTheme } from "./modern";

export const THEME_REGISTRY = {
  luxury: LuxuryTheme,
  classic: ClassicTheme,
  modern: ModernTheme,  // ✅ Added
};
```

---

## Migration Plan

### Phase 1: ✅ DONE
- [x] Create theme types and interfaces
- [x] Create Luxury theme components
- [x] Create Classic theme components
- [x] Create refactored booking page

### Phase 2: TODO
- [ ] Add cart sidebar/modal UI
- [ ] Add checkout flow UI
- [ ] Migrate remaining 3 themes (Modern, Minimal, Portfolio)
- [ ] Add i18n support to theme components

### Phase 3: TODO
- [ ] Test both themes thoroughly
- [ ] Switch production to use `booking-page-refactored.tsx`
- [ ] Remove old `booking-page.tsx`

---

## File Structure

```
src/components/booking/
├─ booking-page.tsx              # OLD (2,018 lines, deprecated)
├─ booking-page-refactored.tsx   # NEW (100 lines, clean)
├─ layouts/                      # OLD layout wrappers (can be removed)
│   ├─ layout-wrapper.tsx
│   └─ luxury-layout.tsx
└─ themes/                       # NEW theme system
    ├─ types.ts                  # Interfaces
    ├─ utils.ts                  # Helpers
    ├─ index.ts                  # Registry
    ├─ shared/                   # Shared components
    │   ├─ SocialIcons.tsx
    │   └─ SocialConfig.ts
    ├─ luxury/                   # Luxury theme (complete)
    │   ├─ index.tsx
    │   ├─ HeroSection.tsx
    │   ├─ AboutSection.tsx
    │   ├─ ServicesSection.tsx
    │   ├─ ProductsSection.tsx
    │   ├─ GallerySection.tsx
    │   ├─ ContactSection.tsx
    │   ├─ SocialSection.tsx
    │   └─ VideoSection.tsx
    └─ classic/                  # Classic theme (complete)
        ├─ index.tsx
        ├─ HeroSection.tsx
        ├─ AboutSection.tsx
        ├─ ServicesSection.tsx
        ├─ ProductsSection.tsx
        ├─ GallerySection.tsx
        ├─ ContactSection.tsx
        ├─ SocialSection.tsx
        └─ VideoSection.tsx
```

---

## Testing

```bash
# Test Luxury theme
Visit: /{merchant-slug}?theme=luxury

# Test Classic theme
Visit: /{merchant-slug}?theme=classic

# In dashboard, switch theme:
Settings → Design → Layout: Luxury
Settings → Design → Colors: Custom gold/black
```

---

## Summary

**Before:** Hardcoded 2000-line file with minor theme tweaks
**After:** Flexible component architecture with true theme separation

**Your idea was correct!** Themes should be separate components that accept `data + colors` and own their complete structure. This refactor implements that vision.
