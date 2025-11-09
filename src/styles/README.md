# ElevateGRE Styles Directory

This directory contains all CSS stylesheets for the ElevateGRE application, organized in a production-ready structure.

## 📁 Directory Structure

```
styles/
├── index.css           # Main entry point - imports all styles
├── theme.css           # Design tokens, CSS variables, colors
├── base/               # Global base styles
│   └── index.css       # Resets, typography, global styles
├── components/         # Component-specific styles
│   ├── Calculator.css
│   ├── ChatBot.css
│   ├── Graph.css
│   ├── Layout.css
│   └── QuizResults.css
├── pages/              # Page-specific styles
│   ├── Dashboard.css
│   ├── Landing.css
│   ├── Metrics.css
│   ├── Profile.css
│   ├── QuestionsArena.css
│   └── Quiz.css
└── utils/              # Utility classes (reserved for future use)
```

## 🎯 Import Order

The main `index.css` imports styles in this specific order:

1. **Theme** - CSS variables and design tokens
2. **Base** - Global resets, typography, and base styles
3. **Components** - Component-specific styles
4. **Pages** - Page-specific styles
5. **Utils** - Utility classes (optional)

## 💡 Usage

### In main.jsx
```javascript
import './styles/index.css'
```

This single import loads all stylesheets in the correct order.

### Components and Pages
**Do NOT import CSS files directly** in components or pages. All styles are centrally managed through `styles/index.css`.

## 🎨 Design Tokens (theme.css)

The `theme.css` file contains:
- Color palette
- Spacing scale
- Typography scale
- Border radius values
- Shadow definitions
- Breakpoints

Use CSS variables in your stylesheets:
```css
.my-element {
  color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}
```

## 📝 Naming Conventions

### BEM Methodology
We use BEM (Block Element Modifier) for class names:

```css
/* Block */
.quiz-card { }

/* Element */
.quiz-card__title { }

/* Modifier */
.quiz-card--highlighted { }
```

### Component Prefix
Each component uses a unique prefix:
- `quiz-` for Quiz components
- `dashboard-` for Dashboard components
- `chatbot-` for ChatBot components
- etc.

## 🔄 Migration Notes

All CSS files have been moved from their original locations:
- `src/components/*.css` → `src/styles/components/`
- `src/pages/*.css` → `src/styles/pages/`
- `src/index.css` → `src/styles/base/index.css`

Individual CSS imports have been removed from components and pages.

## 🚀 Benefits

1. **Centralized Management** - All styles in one location
2. **Predictable Load Order** - Consistent cascade
3. **Better Organization** - Clear separation of concerns
4. **Easier Maintenance** - Find styles quickly
5. **Performance** - Single import reduces HTTP requests
6. **Scalability** - Easy to add new styles

## 📦 Production Build

During build, Vite will:
- Bundle all CSS into a single minified file
- Remove unused styles (tree-shaking)
- Optimize for production

## 🎯 Best Practices

1. **Use CSS Variables** - Leverage theme.css for consistency
2. **Avoid Inline Styles** - Keep all styles in CSS files
3. **Component Scoping** - Use unique class prefixes
4. **Mobile First** - Write mobile styles first, add desktop with media queries
5. **Semantic Names** - Use descriptive class names

## 🔍 Finding Styles

- **Component styles**: `styles/components/ComponentName.css`
- **Page styles**: `styles/pages/PageName.css`
- **Global styles**: `styles/base/index.css`
- **Design tokens**: `styles/theme.css`

## ⚙️ Modifying Styles

To modify styles:
1. Locate the appropriate CSS file
2. Make your changes
3. Save the file
4. Changes will hot-reload in development

## 🐛 Troubleshooting

**Styles not applying?**
- Check that `styles/index.css` is imported in `main.jsx`
- Verify the component/page CSS is listed in `styles/index.css`
- Clear your browser cache
- Check for CSS specificity issues

**Conflicting styles?**
- Ensure unique class names with component prefixes
- Check the import order in `styles/index.css`
- Use more specific selectors if needed

---

Last updated: November 9, 2025

