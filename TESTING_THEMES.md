# Testing Luxury & Classic Themes

## ✅ Setup Complete

The refactored theme system is now live! Here's how to test both themes:

---

## 🚀 Quick Start

Your dev server should already be running on `http://localhost:3000`

If not, start it:
```bash
npm run dev
```

---

## 📝 Testing Checklist

### **1. Test Luxury Theme**

#### Set Luxury Theme in Dashboard:
1. Go to: `http://localhost:3000/dashboard`
2. Navigate to: **Design** or **Themes** page
3. Select: **Luxury** layout
4. Choose color scheme: **Opulence** (Gold & Black) or **Coastal** (Blue & Beige)
5. Save settings

#### View Booking Page:
1. Go to your merchant booking page: `http://localhost:3000/{your-slug}`
2. You should see:
   - ✅ **Full-screen parallax hero** with cover image
   - ✅ **Floating side navigation** dots (on desktop, right side)
   - ✅ **Glass morphism containers** with frosted backgrounds
   - ✅ **Gold shimmer effects** on buttons (hover to see)
   - ✅ **Split-screen about section** (if cover image exists)
   - ✅ **Premium services list** with left accent bar
   - ✅ **Magazine-style gallery** (first image spans 2x2)
   - ✅ **Smooth scroll animations**

#### Test Interactions:
- [ ] Click hero "Explore Services" button → scrolls to services
- [ ] Hover over service cards → see left gold accent bar grow
- [ ] Click "Add to Cart" (+) button → gold shimmer effect
- [ ] Hover gallery images → scale effect + overlay
- [ ] Click gallery image → opens lightbox modal
- [ ] Scroll page → floating navigation dots update
- [ ] Click navigation dot → smooth scroll to section

---

### **2. Test Classic Theme**

#### Set Classic Theme in Dashboard:
1. Go to: `http://localhost:3000/dashboard`
2. Navigate to: **Design** or **Themes** page
3. Select: **Classic** layout
4. Choose color scheme: **Distinguished** (Brown & Cream)
5. Save settings

#### View Booking Page:
1. Go to your merchant booking page: `http://localhost:3000/{your-slug}`
2. You should see:
   - ✅ **Centered symmetrical hero** with square logo
   - ✅ **Decorative divider lines** (line-dot-line pattern)
   - ✅ **Serif typography** (traditional fonts)
   - ✅ **Menu-style services** (bordered list layout)
   - ✅ **Simple product grid** (2/3/4 columns)
   - ✅ **Classic gallery grid** (uniform squares)
   - ✅ **Traditional contact layout** (icon-based)

#### Test Interactions:
- [ ] Click hero "View Our Services" button → scrolls to services
- [ ] Hover service items → subtle background color change
- [ ] Click "Add to Cart" (+) button → simple scale effect
- [ ] Hover gallery images → scale effect + caption
- [ ] Click gallery image → opens lightbox modal
- [ ] All sections use consistent serif fonts

---

## 🎨 Theme Comparison

| Feature | Luxury | Classic |
|---------|--------|---------|
| **Hero** | Full-screen parallax | Centered stacked |
| **Typography** | Light uppercase | Serif traditional |
| **Services** | Glass containers | Menu list |
| **Gallery** | Magazine masonry | Uniform grid |
| **Effects** | Gold shimmer, parallax | Simple hover |
| **Navigation** | Floating dots | None (scroll only) |
| **Best For** | High-end spas, resorts | Barbershops, classic |

---

## 🐛 Common Issues & Solutions

### Issue: Theme not changing
**Solution:**
- Clear browser cache (Cmd+Shift+R)
- Check database: `merchants.theme.layoutTemplate` should be "luxury" or "classic"
- Restart dev server

### Issue: Images not showing
**Solution:**
- Check image URLs in database are public URLs
- Verify Supabase storage permissions
- Check browser console for 404 errors

### Issue: TypeScript errors
**Solution:**
```bash
npx tsc --noEmit
```
All errors should be fixed. If any remain, report them.

### Issue: Styles not applying
**Solution:**
- Check that `<style jsx>` tags are rendering (view page source)
- Verify colors are being passed correctly to theme components
- Check browser console for CSS errors

---

## 📊 What to Test

### **Functionality:**
- [ ] Cart: Add services to cart
- [ ] Cart: Add products to cart (with quantity)
- [ ] Cart: Remove items from cart
- [ ] Gallery: Click images to open lightbox
- [ ] Gallery: Close lightbox (X button or background click)
- [ ] Navigation: Scroll to sections
- [ ] Responsive: Test on mobile, tablet, desktop

### **Visual Quality:**
- [ ] **Luxury**: Gold accents visible and consistent
- [ ] **Luxury**: Glass morphism effect (frosted backgrounds)
- [ ] **Luxury**: Parallax scrolling smooth
- [ ] **Luxury**: Floating navigation dots appear on scroll
- [ ] **Classic**: Serif fonts applied throughout
- [ ] **Classic**: Decorative lines between sections
- [ ] **Classic**: Symmetrical layouts maintained

### **Performance:**
- [ ] Page loads in <3 seconds
- [ ] Smooth scrolling (60fps)
- [ ] No layout shifts (CLS)
- [ ] Images load progressively

---

## 🔍 Debugging

### Check Theme Data:
Open browser console and type:
```javascript
// See what theme is loaded
console.log(window.__NEXT_DATA__);
```

### Check Component Rendering:
Look for these elements in page source:
```html
<!-- Luxury Theme -->
<div class="luxury-layout">
  <div class="luxury-glass-container">

<!-- Classic Theme -->
<div class="classic-layout">
  <section class="py-16 px-6 bg-gray-50">
```

### Check Color Application:
Inspect any element and verify:
```css
/* Should see inline styles like: */
style="background-color: rgb(212, 175, 55); /* Gold */"
style="font-family: 'Playfair Display';"
```

---

## 📸 Screenshot Checklist

Take screenshots of:
1. **Luxury Hero** - Full-screen with parallax
2. **Luxury Services** - Glass container with services
3. **Luxury Gallery** - Magazine-style layout
4. **Classic Hero** - Centered with decorative lines
5. **Classic Services** - Menu-style list
6. **Classic Gallery** - Uniform grid

---

## ✅ Success Criteria

The themes are working correctly if:

1. **Luxury Theme Shows:**
   - Gold accents throughout
   - Glass morphism effects
   - Floating navigation dots (desktop)
   - Smooth parallax scrolling
   - Premium animations on hover

2. **Classic Theme Shows:**
   - Serif typography
   - Decorative line dividers
   - Symmetrical centered layouts
   - Traditional color schemes
   - Simple professional look

3. **Both Themes:**
   - Cart functionality works
   - Gallery lightbox works
   - Responsive on all devices
   - No TypeScript/console errors
   - Smooth 60fps performance

---

## 🎯 Next Steps After Testing

Once both themes are tested and working:

1. **Report Issues:** Create list of bugs found
2. **Confirm Cart/Checkout:** Note that cart UI is minimal (needs full implementation)
3. **Request Remaining Themes:** Modern, Minimal, Portfolio
4. **Production Deploy:** Once stable, deploy to production

---

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify theme settings in database
3. Clear cache and restart dev server
4. Check `THEME_REFACTOR_GUIDE.md` for architecture details

---

**Happy Testing! 🎉**

The refactored theme system is now live with 2 complete themes ready to use.
