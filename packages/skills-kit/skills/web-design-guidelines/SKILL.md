---
name: web-design-guidelines
description: Comprehensive web design and UI/UX guidelines covering accessibility, performance, typography, animations, theming, forms, images, navigation, and internationalization. Use when building accessible, performant web applications.
metadata:
  category: design
  version: "1.0.0"
  tags:
    - design
    - ui
    - ux
    - accessibility
    - performance
    - a11y
    - web
    - typography
    - animation
    - forms
    - i18n
  owner: vercel-labs
  originalSource: https://github.com/vercel-labs/agent-skills
---

# Web Design Guidelines

This skill provides comprehensive web design and UI/UX guidelines to help you build accessible, performant, and user-friendly web applications. Based on industry best practices and Vercel engineering standards.

## When to Use

Use this skill when you need guidance on:

- Accessibility (a11y) best practices
- Performance optimization for UI
- Typography and readability
- Animation and motion design
- Form design and validation
- Image optimization
- Navigation patterns
- Dark mode and theming
- Touch interactions
- Internationalization (i18n)

## Guidelines by Category

### 1. Accessibility

Ensuring your application is usable by everyone, including people with disabilities.

#### Semantic HTML

1. **Use semantic elements** - Use `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>` appropriately
2. **Proper heading hierarchy** - Use `<h1>` through `<h6>` in order without skipping levels
3. **Landmarks** - Provide ARIA landmarks for screen reader navigation
4. **Lists** - Use `<ul>`, `<ol>`, `<dl>` for list content

```html
<!-- ✅ Good: Semantic structure -->
<main>
  <article>
    <header>
      <h1>Article Title</h1>
    </header>
    <section>
      <h2>Section Heading</h2>
      <p>Content...</p>
    </section>
  </article>
</main>

<!-- ❌ Bad: Div soup -->
<div class="main">
  <div class="article">
    <div class="header">
      <div class="title">Article Title</div>
    </div>
  </div>
</div>
```

#### Focus Management

1. **Visible focus indicators** - Never remove focus outlines without providing alternatives
2. **Focus order** - Ensure logical tab order (use `tabindex="0"` or `tabindex="-1"`)
3. **Skip links** - Provide skip navigation links for keyboard users
4. **Focus trapping** - Trap focus in modals and dialogs

```css
/* ✅ Good: Custom focus indicator */
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
}

/* ❌ Bad: Removing focus without replacement */
button:focus {
  outline: none;
}
```

#### ARIA Labels

1. **Label all interactive elements** - Use `aria-label` or `aria-labelledby`
2. **Describe state changes** - Use `aria-live` for dynamic content
3. **Icon buttons** - Always provide accessible names for icon-only buttons
4. **Form inputs** - Associate labels with form controls

```tsx
// ✅ Good: Accessible icon button
<button aria-label="Close dialog">
  <CloseIcon aria-hidden="true" />
</button>

// ✅ Good: Live region for updates
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// ❌ Bad: No accessible name
<button>
  <CloseIcon />
</button>
```

#### Color and Contrast

1. **Minimum contrast ratio** - 4.5:1 for normal text, 3:1 for large text
2. **Don't rely on color alone** - Use icons, patterns, or text in addition to color
3. **Test with color blindness simulators** - Ensure usability for all users

### 2. Performance

Optimizing UI performance for fast, responsive experiences.

#### Layout Performance

1. **Avoid layout thrashing** - Batch DOM reads and writes
2. **Use `transform` and `opacity`** - For animations (GPU-accelerated)
3. **Minimize reflows** - Avoid changing layout properties frequently
4. **Use `content-visibility`** - For off-screen content

```css
/* ✅ Good: GPU-accelerated animation */
.animate {
  transform: translateX(100px);
  transition: transform 0.3s ease;
}

/* ❌ Bad: Triggers reflow */
.animate {
  left: 100px;
  transition: left 0.3s ease;
}
```

#### Virtualization

1. **Virtualize long lists** - Use react-window or react-virtualized
2. **Infinite scroll** - Load content progressively
3. **Pagination** - For very large datasets

```tsx
// ✅ Good: Virtualized list
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={10000}
  itemSize={50}
  width="100%"
>
  {Row}
</FixedSizeList>
```

#### Resource Loading

1. **Lazy load images** - Use `loading="lazy"` attribute
2. **Preload critical resources** - Use `<link rel="preload">`
3. **Defer non-critical scripts** - Use `defer` or `async`
4. **Code splitting** - Load components on demand

### 3. Typography

Creating readable, beautiful text experiences.

#### Font Loading

1. **Use `font-display: swap`** - Prevent FOIT (Flash of Invisible Text)
2. **Subset fonts** - Only include needed characters
3. **Preload critical fonts** - Use `<link rel="preload">`
4. **System font stack fallbacks** - Provide good fallbacks

```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+0000-00FF; /* Latin subset */
}
```

#### Readability

1. **Line length** - 45-75 characters per line (ideal: 66)
2. **Line height** - 1.4-1.6 for body text
3. **Font size** - Minimum 16px for body text
4. **Contrast** - Sufficient contrast between text and background

```css
/* ✅ Good: Readable typography */
.body-text {
  font-size: 1rem; /* 16px */
  line-height: 1.6;
  max-width: 65ch; /* ~65 characters */
}

/* ❌ Bad: Hard to read */
.body-text {
  font-size: 12px;
  line-height: 1;
  max-width: 100%;
}
```

#### Responsive Typography

1. **Use relative units** - `rem`, `em`, or `clamp()`
2. **Scale appropriately** - Adjust sizes for different viewports
3. **Maintain hierarchy** - Keep visual hierarchy consistent

```css
/* ✅ Good: Fluid typography */
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}

/* ✅ Good: Responsive base */
html {
  font-size: 16px;
}

@media (min-width: 768px) {
  html {
    font-size: 18px;
  }
}
```

### 4. Animations

Creating smooth, purposeful animations.

#### Motion Preferences

1. **Respect `prefers-reduced-motion`** - Reduce or disable animations
2. **Provide alternatives** - Use fade instead of movement when reduced
3. **Essential vs decorative** - Only keep essential animations

```css
/* ✅ Good: Respecting motion preferences */
.animated-element {
  transition: transform 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .animated-element {
    transition: opacity 0.3s ease;
    transform: none;
  }
}
```

#### Animation Performance

1. **Use `transform` and `opacity`** - GPU-accelerated properties
2. **Use `will-change` sparingly** - Only for known upcoming animations
3. **Keep animations short** - 200-500ms for most interactions
4. **Use easing functions** - Natural motion with ease-in-out

```css
/* ✅ Good: Performant animation */
.card {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
```

#### Meaningful Motion

1. **Purpose** - Every animation should have a purpose
2. **Direction** - Motion should indicate direction or relationship
3. **Staggering** - Stagger list animations for visual interest
4. **Feedback** - Provide immediate feedback for interactions

### 5. Forms

Designing usable, accessible forms.

#### Form Structure

1. **Group related fields** - Use `<fieldset>` and `<legend>`
2. **Label placement** - Labels above or to the left of inputs
3. **Required indicators** - Mark required fields clearly
4. **Help text** - Provide context with `aria-describedby`

```tsx
// ✅ Good: Accessible form structure
<fieldset>
  <legend>Contact Information</legend>
  
  <div>
    <label htmlFor="email">
      Email <span aria-hidden="true">*</span>
    </label>
    <input
      id="email"
      type="email"
      required
      aria-required="true"
      aria-describedby="email-help"
    />
    <p id="email-help">We'll never share your email.</p>
  </div>
</fieldset>
```

#### Validation

1. **Inline validation** - Validate on blur, not on every keystroke
2. **Clear error messages** - Specific, actionable error text
3. **Error summary** - List all errors at form top on submit
4. **Use native validation** - HTML5 validation attributes

```tsx
// ✅ Good: Clear error handling
<div>
  <label htmlFor="password">Password</label>
  <input
    id="password"
    type="password"
    aria-invalid={errors.password ? "true" : "false"}
    aria-describedby="password-error"
  />
  {errors.password && (
    <p id="password-error" role="alert" className="error">
      Password must be at least 8 characters with one number
    </p>
  )}
</div>
```

#### Input Types

1. **Use correct input types** - `email`, `tel`, `url`, `number`, `date`
2. **Autocomplete attributes** - Help browsers autofill
3. **Input modes** - Use `inputmode` for mobile keyboards

```html
<!-- ✅ Good: Appropriate input types -->
<input type="email" autocomplete="email" />
<input type="tel" autocomplete="tel" inputmode="tel" />
<input type="number" inputmode="numeric" />
```

### 6. Images

Optimizing images for performance and accessibility.

#### Image Optimization

1. **Modern formats** - Use WebP or AVIF with fallbacks
2. **Responsive images** - Use `srcset` and `sizes`
3. **Lazy loading** - Use `loading="lazy"` for below-fold images
4. **Explicit dimensions** - Set `width` and `height` to prevent CLS

```tsx
// ✅ Good: Optimized responsive image
<picture>
  <source
    srcSet="/image.avif"
    type="image/avif"
  />
  <source
    srcSet="/image.webp"
    type="image/webp"
  />
  <img
    src="/image.jpg"
    alt="Descriptive alt text"
    loading="lazy"
    width={800}
    height={600}
    decoding="async"
  />
</picture>
```

#### Alt Text

1. **Descriptive** - Describe the image content and purpose
2. **Context-aware** - Consider the surrounding content
3. **Decorative images** - Use empty `alt=""` for decorative images
4. **Complex images** - Use `aria-describedby` for detailed descriptions

```tsx
// ✅ Good: Meaningful alt text
<img src="/chart.png" alt="Bar chart showing 50% increase in sales from Q1 to Q4 2024" />

// ✅ Good: Decorative image
<img src="/decorative-divider.svg" alt="" role="presentation" />
```

### 7. Navigation

Creating intuitive navigation patterns.

#### Navigation Structure

1. **Consistent location** - Keep navigation in predictable places
2. **Current page indicator** - Show active state with `aria-current="page"`
3. **Breadcrumbs** - For deep hierarchies
4. **Mobile navigation** - Accessible hamburger menus

```tsx
// ✅ Good: Accessible navigation
<nav aria-label="Main navigation">
  <ul>
    <li>
      <a href="/" aria-current="page">Home</a>
    </li>
    <li>
      <a href="/about">About</a>
    </li>
    <li>
      <a href="/contact">Contact</a>
    </li>
  </ul>
</nav>
```

#### Link Best Practices

1. **Descriptive link text** - Never use "click here" or "read more"
2. **External links** - Indicate with icon and `target="_blank"` with `rel="noopener"`
3. **Skip links** - Allow keyboard users to skip to main content
4. **Focus visible** - Ensure focused links are clearly visible

### 8. Dark Mode & Theming

Implementing consistent theme support.

#### CSS Variables

1. **Use CSS custom properties** - For easy theme switching
2. **Semantic naming** - Name by purpose, not appearance
3. **Fallbacks** - Provide fallback values

```css
/* ✅ Good: Semantic theme variables */
:root {
  --color-background: #ffffff;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #6b7280;
  --color-accent: #3b82f6;
  --color-border: #e5e7eb;
}

[data-theme="dark"] {
  --color-background: #0f172a;
  --color-text-primary: #f8fafc;
  --color-text-secondary: #94a3b8;
  --color-accent: #60a5fa;
  --color-border: #334155;
}
```

#### System Preference Detection

1. **Detect system preference** - Use `prefers-color-scheme`
2. **Allow override** - Let users choose their preference
3. **Persist choice** - Save preference to localStorage

```css
/* ✅ Good: System preference detection */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-background: #0f172a;
    --color-text-primary: #f8fafc;
  }
}
```

### 9. Touch & Interaction

Designing for touch interfaces.

#### Touch Targets

1. **Minimum size** - 44x44px for touch targets (WCAG 2.2)
2. **Spacing** - Adequate spacing between targets
3. **Visual feedback** - Immediate response to touch

```css
/* ✅ Good: Accessible touch targets */
.button {
  min-width: 44px;
  min-height: 44px;
  padding: 12px 24px;
}

.touch-feedback {
  transition: transform 0.1s ease;
}

.touch-feedback:active {
  transform: scale(0.98);
}
```

#### Gestures

1. **Provide alternatives** - Don't rely solely on gestures
2. **Discoverable** - Make gesture-based actions visible
3. **Cancel-able** - Allow users to cancel mid-gesture

### 10. Internationalization (i18n)

Supporting multiple languages and locales.

#### Text Direction

1. **Support RTL** - Use logical properties (`margin-inline-start`)
2. **dir attribute** - Set `dir="rtl"` for RTL languages
3. **Bidirectional text** - Handle mixed direction content

```css
/* ✅ Good: Logical properties */
.container {
  margin-inline-start: 1rem;
  padding-inline-end: 1rem;
  border-inline-start: 2px solid;
}

/* ❌ Bad: Physical properties */
.container {
  margin-left: 1rem;
  padding-right: 1rem;
  border-left: 2px solid;
}
```

#### Number and Date Formatting

1. **Use Intl API** - For locale-aware formatting
2. **Date formats** - Respect locale date formats
3. **Number formats** - Decimal separators, currency

```tsx
// ✅ Good: Locale-aware formatting
const formatDate = (date: Date, locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
  }).format(date);
};

const formatCurrency = (amount: number, locale: string, currency: string) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};
```

#### Text Expansion

1. **Allow for expansion** - Some languages need 30-50% more space
2. **Avoid fixed widths** - Use flexible layouts
3. **Test with longer strings** - Use pseudo-localization

## Additional Resources

- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Web.dev](https://web.dev/)
- [Vercel Design System](https://vercel.com/design)

## Examples

### Example 1: Accessible Button Component

```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  'aria-label'?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled,
  loading,
  'aria-label': ariaLabel,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabel}
      className={`btn btn-${variant}`}
    >
      {loading ? (
        <>
          <Spinner aria-hidden="true" />
          <span className="sr-only">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
```

### Example 2: Responsive Image Component

```tsx
interface ResponsiveImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  priority = false,
}: ResponsiveImageProps) {
  const basePath = src.replace(/\.[^.]+$/, '');
  const ext = src.match(/\.([^.]+)$/)?.[1] || 'jpg';

  return (
    <picture>
      <source
        srcSet={`${basePath}.avif`}
        type="image/avif"
      />
      <source
        srcSet={`${basePath}.webp`}
        type="image/webp"
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
}
```
