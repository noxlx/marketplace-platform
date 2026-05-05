# Iraqi Marketplace - Complete Style Guide & Design System

## Overview
This document describes the complete modern design system for the Iraqi Marketplace platform, including color palette, typography, components, animations, and interactive patterns.

---

## 🎨 Color System

### Primary Colors
- **Primary (Teal)**: `#0f766e` - Main brand color for CTAs and key elements
- **Primary Light**: `#14b8a6` - Lighter variant for hover states
- **Primary 50-900**: Full color scale for semantic variations

### Secondary Colors (Neutrals)
- **Secondary 50**: `#f8fafc` - Lightest background
- **Secondary 900**: `#0f172a` - Darkest text
- **Secondary Range**: Provides 10 shades for text, borders, and backgrounds

### Accent Colors
- **Red** (`#ef4444`): Error, danger, important actions
- **Amber** (`#f59e0b`): Warnings, pending states
- **Green** (`#10b981`): Success, approved, available
- **Blue** (`#3b82f6`): Information, links, secondary actions

### Gradients
```css
/* Brand Gradient */
background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);

/* Hero Gradient */
background: linear-gradient(135deg, #0f766e 0%, #1e40af 100%);

/* Card Gradient */
background: linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%);
```

---

## 🔤 Typography

### Heading Hierarchy
- **h1**: 48px-60px | Bold | Line-height 1.1
- **h2**: 36px-48px | Bold | Line-height 1.1
- **h3**: 24px-36px | Bold | Line-height 1.1
- **h4**: 20px-24px | Semibold | Line-height 1.2
- **h5**: 18px-20px | Semibold | Line-height 1.2
- **h6**: 16px-18px | Semibold | Line-height 1.3

### Body Text
- **Large**: 18px | Regular | Line-height 1.6
- **Base**: 16px | Regular | Line-height 1.6
- **Small**: 14px | Regular | Line-height 1.5
- **Extra Small**: 12px | Regular | Line-height 1.4

### Font Family
`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`

---

## 🎯 Components

### Buttons

#### Primary Button
```tsx
<button className="btn-primary">
  Click Me
</button>
```
- Background: Gradient primary
- Hover: Scale 1.05 + Enhanced shadow
- Active: Scale 0.95
- Text: White, Bold

#### Secondary Button
```tsx
<button className="btn-secondary">
  Cancel
</button>
```
- Background: Secondary light
- Hover: Darker shade
- Text: Secondary dark

#### Outline Button
```tsx
<button className="btn-outline">
  Learn More
</button>
```
- Border: 2px primary
- Background: Transparent
- Hover: Light primary background

#### Ghost Button
```tsx
<button className="btn-ghost">
  Link Button
</button>
```
- No background
- Text: Primary color
- Hover: Light background

### Cards

#### Interactive Card
```tsx
<div className="card card-hover">
  {/* Content */}
</div>
```
- Background: White
- Border-radius: 12px
- Shadow: Soft glow effect
- Hover: Enhanced shadow + Transform Y-4px
- Animation: Smooth transition 300ms

### Badges

#### Status Badges
```tsx
<span className="badge-primary">Active</span>
<span className="badge-success">Verified</span>
<span className="badge-warning">Pending</span>
<span className="badge-danger">Failed</span>
```

- Padding: 6px 12px
- Border-radius: 999px
- Font: 12px Bold
- Color-coded backgrounds

### Input Fields

#### Text Input
```tsx
<input
  type="text"
  placeholder="Enter text"
  className="input-base"
/>
```

- Padding: 12px 16px
- Border: 1px secondary-300
- Border-radius: 8px
- Focus: Ring-2 primary-500 + Subtle shadow
- Hover: Border color change

---

## ✨ Animations

### Built-in Animations

#### Fade In
```css
animation: fadeIn 0.3s ease-in-out;
```
- Duration: 300ms
- Use: Page loads, element reveals

#### Slide Up
```css
animation: slideUp 0.3s ease-out;
```
- Duration: 300ms
- Use: Modal entries, list items

#### Bounce Gentle
```css
animation: bounceGentle 2s infinite;
```
- Duration: 2s infinite
- Use: Loading indicators, attention grabbers

#### Pulse Glow
```css
animation: pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```
- Duration: 2s infinite
- Use: Active states, notifications

#### Shimmer
```css
animation: shimmer 2s infinite;
```
- Duration: 2s infinite
- Use: Loading skeletons

### Hover Effects

#### Scale Up
```css
hover:scale-105 transition-transform duration-300
```

#### Lift
```css
hover:-translate-y-1 transition-transform duration-300
```

#### Glow
```css
hover:shadow-lg-glow transition-all duration-300
```

---

## 🔆 Shadow System

### Soft Shadows
```css
box-shadow: 0 2px 8px rgba(15, 118, 110, 0.1);
```

### Medium Shadows
```css
box-shadow: 0 4px 12px rgba(15, 118, 110, 0.15);
```

### Large Shadows
```css
box-shadow: 0 8px 24px rgba(15, 118, 110, 0.2);
```

### XL Shadows
```css
box-shadow: 0 12px 32px rgba(15, 118, 110, 0.25);
```

---

## 📱 Responsive Breakpoints

```tailwind
sm: 640px   - Small phones
md: 768px   - Tablets
lg: 1024px  - Desktops
xl: 1280px  - Large screens
2xl: 1536px - Extra large screens
```

### Responsive Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## 🎭 Interactive Elements

### Modal Dialog
- Backdrop: Black 50% opacity
- Animation: Fade in + Slide up
- Rounded corners: 12px
- Responsive: Full viewport on mobile, centered on desktop

### Toast Notifications
- Position: Bottom-right fixed
- Animation: Slide up + Fade in
- Duration: Auto-dismiss after 3s
- Types: Success, Error, Warning, Info

### Dropdown Menu
- Position: Relative/Absolute
- Animation: Fade in
- Z-index: Layered above content

---

## 🚀 Usage Patterns

### Interactive Listing Card
```tsx
<Link href={`/listings/${id}`} className="card card-hover group">
  <div className="relative h-48 overflow-hidden">
    <img className="group-hover:scale-110 transition" />
    <button className="absolute top-3 right-3 hover:scale-110">
      {/* Favorite Icon */}
    </button>
  </div>
  <div>
    <h3 className="group-hover:text-primary-600">{title}</h3>
    <button className="btn-primary w-full">View Details</button>
  </div>
</Link>
```

### Form with Validation
```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <input
    className="input-base"
    placeholder="Enter value"
  />
  {error && <p className="text-xs text-accent-red">{error}</p>}
  <button className="btn-primary w-full">Submit</button>
</form>
```

### Loading State
```tsx
<div className="card">
  {loading ? (
    <div className="animate-shimmer h-12 bg-secondary-200 rounded" />
  ) : (
    <p>{content}</p>
  )}
</div>
```

---

## 📊 Design Tokens

### Spacing Scale
```
2px, 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 56px, 64px
```

### Border Radius
```
4px   - Small
8px   - Medium
12px  - Large
999px - Fully rounded (pills/circles)
```

### Transition Timing
```
200ms  - Quick (simple interactions)
300ms  - Standard (most interactions)
400ms  - Smooth (complex transitions)
500ms  - Slow (major layout changes)
```

---

## ✅ Accessibility

- All interactive elements have `:focus-visible` states
- Color contrast ratios meet WCAG AA standards
- Semantic HTML used throughout
- ARIA labels on interactive components
- Keyboard navigation supported
- Screen reader friendly

---

## 🔄 Dark Mode Ready

The design system includes CSS variables that can be toggled for dark mode:

```css
@media (prefers-color-scheme: dark) {
  body {
    background: var(--secondary-950);
  }
  .card {
    background: var(--secondary-900);
  }
}
```

---

## 📦 Component Library

### Pre-built Components
- **Button**: 4 variants × 3 sizes = 12 combinations
- **Card**: Base + Hoverable variant
- **Badge**: 5 status variants
- **Input**: With label and error support
- **Loading**: Spinner + Skeleton loaders
- **Interactive**: Toast, Modal, Dropdown

### Usage Example
```tsx
import { Button, Card, Badge, Input } from '@/components';

export default function Example() {
  return (
    <Card hoverable>
      <Badge variant="success">Active</Badge>
      <h2>Title</h2>
      <Input label="Name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

---

## 🎨 Theme Configuration

Located in `tailwind.config.ts`:
- Customize colors
- Add/modify animations
- Adjust breakpoints
- Configure shadow system
- Extend spacing scale

---

## 📝 Best Practices

1. **Use semantic color names** - Primary for CTAs, Success for confirmations
2. **Consistent spacing** - Use 4px, 8px, 16px, 24px multiples
3. **Animate purposefully** - Don't animate just because you can
4. **Mobile-first** - Design for small screens first
5. **Test accessibility** - Use keyboard navigation
6. **Follow component patterns** - Reuse existing components
7. **Maintain readability** - Adequate color contrast and font sizing
8. **Responsive images** - Use srcset and responsive classes

---

## 🚀 Performance Tips

- Use CSS Grid for layouts (better than flexbox for complex layouts)
- Lazy-load images with next/image component
- Implement pagination for long lists
- Use React.memo for expensive components
- Debounce search inputs
- Cache API responses

---

Generated: 2026-05-05
Design System Version: 1.0
