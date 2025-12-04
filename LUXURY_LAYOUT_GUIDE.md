# 🌟 Luxury Layout System - Complete Guide

## Overview
The Luxury Layout is a **holistic, premium layout system** designed for high-end spas, luxury wellness centers, and premium beauty services. It goes beyond just CSS styling to provide a complete structural transformation of your booking page.

---

## 🎨 Key Features

### 1. **Interactive Floating Navigation**
- **Dot-style side navigation** that tracks scroll position
- Smooth scroll to sections with visual feedback
- Auto-highlights active section
- Desktop-only (hidden on mobile for clean UX)

**Location:** `luxury-layout.tsx:55-68`

### 2. **Parallax Scroll Effects**
- **Dynamic parallax overlay** that moves with scroll
- Fades out as you scroll down for smooth transitions
- Gold radial gradient that creates depth

**Location:** `luxury-layout.tsx:70-77`

### 3. **Split-Screen Layouts**
- **50/50 split sections** with image + content
- Alternates left/right on even/odd sections
- Perfect for showcasing spa environments with descriptions
- Fully responsive (stacks on mobile)

**CSS Classes:**
```tsx
<section className="luxury-split">
  <div className="luxury-split-image" style={{backgroundImage: 'url(...)'}} />
  <div className="luxury-split-content">
    {/* Your content */}
  </div>
</section>
```

**Location:** `luxury-layout.tsx:237-313`

### 4. **Full-Bleed Background Sections**
- **100% width parallax backgrounds** with fixed attachment
- Perfect for galleries and hero moments
- Dark overlay for text readability
- Content appears in white for contrast

**CSS Classes:**
```tsx
<section className="luxury-full-bleed" style={{backgroundImage: 'url(...)'}}>
  {/* Your content - automatically styled in white */}
</section>
```

**Location:** `luxury-layout.tsx:315-342`

### 5. **Glass Morphism Containers**
- **Frosted glass effect** with backdrop blur
- Animated gold shimmer overlay
- Premium depth with layered shadows
- Elegant border with gold accent

**CSS Classes:**
```tsx
<section className="luxury-default-section">
  <div className="luxury-glass-container">
    {/* Your content */}
  </div>
</section>
```

**Location:** `luxury-layout.tsx:344-407`

---

## 🏗️ Architecture

### Layout Structure
```
LuxuryLayout (Main wrapper)
  ├── Ambient Background (Fixed animated gradients)
  ├── Floating Side Navigation (Dot menu)
  ├── Parallax Overlay (Scroll-reactive)
  └── Content Wrapper
       ├── Section 1: Hero (Full-screen)
       ├── Section 2: About (Split-screen or Glass)
       ├── Section 3: Services (Split-screen or Glass)
       ├── Section 4: Gallery (Full-bleed or Magazine grid)
       └── Section 5: Contact (Glass container)
```

---

## 🎯 Usage Examples

### Example 1: Split-Screen About Section
```tsx
<section className="luxury-split">
  <div
    className="luxury-split-image"
    style={{backgroundImage: 'url(/spa-interior.jpg)'}}
  />
  <div className="luxury-split-content">
    <h2>About Our Luxury Spa</h2>
    <p>Premium wellness experience...</p>
  </div>
</section>
```

### Example 2: Full-Bleed Gallery Hero
```tsx
<section
  className="luxury-full-bleed"
  style={{backgroundImage: 'url(/spa-hero.jpg)'}}
>
  <h1>Our Gallery</h1>
  <div className="grid grid-cols-3 gap-4">
    {/* Gallery images */}
  </div>
</section>
```

### Example 3: Glass Morphism Services
```tsx
<section className="luxury-default-section">
  <div className="luxury-glass-container">
    <h2>Our Premium Services</h2>
    <div className="space-y-4">
      {/* Service list */}
    </div>
  </div>
</section>
```

---

## 🎨 Visual Design Elements

### Gold Accent System
- **Primary Gold:** `#D4AF37` (24k gold)
- **Silver Accent:** `rgba(192, 192, 192, 0.6)`
- Used for:
  - Section dividers with shimmer
  - Navigation dots
  - Button borders and hovers
  - Typography accents (first letters)
  - Link underlines

### Typography Hierarchy
```css
H1: 3rem - 5.5rem (Ultra-thin 200 weight)
H2: 1.75rem - 2.75rem (Light 300 weight)
H3: 1.35rem - 1.85rem (Regular 400 weight)
Body: 1.06rem - 1.18rem (Light 300 weight)
```

### Spacing System
- **Section padding:** 6rem vertical (luxurious breathing room)
- **Content max-width:** 1400px (readable but spacious)
- **Grid gaps:** 1.5rem - 2rem
- **Border radius:** 24px (glass containers)

---

## 📱 Responsive Behavior

### Desktop (>1024px)
- Full split-screen layouts
- Floating side navigation visible
- Parallax effects enabled
- Magazine-style gallery grids

### Tablet (768px - 1024px)
- Split screens stack vertically
- Image always on top
- Navigation hidden
- Maintained glass effects

### Mobile (<768px)
- All sections stack
- Reduced padding (4rem → 3rem)
- Smaller typography
- Simplified animations

---

## 🚀 How to Use With Your Content

### Step 1: Import the Layout
```tsx
import { LuxuryLayout } from './layouts/luxury-layout';
```

### Step 2: Wrap Your Content
```tsx
<LuxuryLayout>
  {/* Your sections here */}
</LuxuryLayout>
```

### Step 3: Apply Layout Classes
Choose the appropriate class for each section:
- `luxury-split` - Split-screen layout
- `luxury-full-bleed` - Full-width background
- `luxury-default-section` + `luxury-glass-container` - Glass effect

---

## ✨ Premium Interactions

### Hover Effects
1. **Buttons:** Gold shimmer radial expansion
2. **Cards:** Float upward with gold glow
3. **Images:** Brightness boost + gold shadow
4. **Links:** Expanding gold underline
5. **Service Items:** Left border animation

### Scroll Animations
1. **Sections:** Fade in from bottom (staggered)
2. **Parallax:** Dynamic overlay movement
3. **Navigation:** Active dot highlighting
4. **Hero:** Gradient glow pulse

### Loading Animations
1. **Nav dots:** Fade in at 1s delay
2. **Sections:** Staggered 0.1s intervals
3. **Ambient BG:** 20s infinite cycle
4. **Glass shimmer:** 8s ease-in-out cycle

---

## 🎭 Theme Integration

### Works With
- **Opulence theme** (Gold #D4AF37 primary)
- **Coastal theme** (Teal with gold accents)
- Any theme with `layoutTemplate: "luxury"`

### Customization Points
All colors respect theme variables:
- `theme.primaryColor` - Main accent color
- `theme.secondaryColor` - Secondary accent
- `theme.backgroundColor` - Background base
- `theme.textColor` - Text color

Gold accents are hardcoded but blend with any theme.

---

## 🔧 Advanced Customization

### Add Custom Section Layouts
Edit `luxury-layout.tsx` and add new classes:

```css
.luxury-layout section.luxury-custom-layout {
  /* Your custom styles */
}
```

### Modify Parallax Speed
Adjust the multiplier in `luxury-layout.tsx:47`:
```tsx
const parallaxTransform = `translateY(${scrollY * 0.5}px)`; // 0.5 = speed
```

### Change Gold Color
Find/replace all instances of:
- `rgba(212, 175, 55, ...)` - Gold with opacity
- `#D4AF37` - Solid gold

---

## 📊 Performance Considerations

### Optimizations
- `will-change` on parallax elements
- `passive: true` on scroll listeners
- CSS transforms for animations (GPU accelerated)
- Backdrop filter with fallbacks

### Loading Strategy
1. Critical CSS inline (layout structure)
2. Animations delayed (navigation at 1s)
3. Images lazy-loaded
4. Parallax only on capable devices

---

## 🎬 Best Practices

### DO ✅
- Use split-screens for storytelling
- Limit full-bleed to 1-2 sections
- Keep glass containers for detailed content
- Use high-quality images (min 1920px wide)
- Maintain consistent section order

### DON'T ❌
- Overuse split-screens (max 2-3)
- Use low-res images in full-bleed
- Stack too many glass containers
- Mix layout styles randomly
- Ignore mobile breakpoints

---

## 🆘 Troubleshooting

### Issue: Navigation dots not showing
**Solution:** Ensure you have at least 3 sections and are on desktop (>1024px)

### Issue: Parallax feels jerky
**Solution:** Images too large. Optimize to <500KB

### Issue: Glass effect not visible
**Solution:** Browser doesn't support backdrop-filter. Fallback is solid background.

### Issue: Split-screen not alternating
**Solution:** Check `:nth-child(even)` CSS selector. May need to adjust based on your HTML structure.

---

## 📝 File Structure

```
src/components/booking/layouts/
├── luxury-layout.tsx              (Main layout wrapper)
├── luxury-section-wrapper.tsx     (Section layout helper)
├── layout-wrapper.tsx             (Route to luxury layout)
└── types.ts                       (TypeScript types)
```

---

## 🔮 Future Enhancements

Potential additions:
- [ ] Video background support for hero
- [ ] Scroll-triggered animations (GSAP)
- [ ] 3D card flip effects
- [ ] Ambient music toggle
- [ ] Luxury color scheme presets
- [ ] AI-generated section suggestions

---

## 📚 Related Documentation

- `database.ts:791` - Luxury theme definition
- `design-form.tsx` - Theme selector UI
- `booking-page.tsx` - Content rendering

---

**Created with ✨ for premium luxury experiences**
