# ElevateGRE - GRE Preparation Platform

A comprehensive GRE preparation platform built with React, TypeScript, and Vite. Practice questions, track your progress, and improve your GRE scores with detailed metrics and analytics.

## Features

### 🏠 Landing Page
Simple, welcoming landing page to introduce users to the platform.

### 📊 Dashboard (Second Most Important)
- Overview of your progress and statistics
- Quick access to practice questions
- Progress tracking by topic
- Performance metrics at a glance

### 👤 Profile Information
- View and manage your profile details
- Track your membership and level
- View overall statistics

### 📈 Metrics & Analytics
- **Accuracy Tracking**: Monitor your accuracy across all questions
- **Time Analytics**: Track time taken per question, per session, and per topic
- **Hints Usage**: See which question types require hints
- **Session History**: Review your recent practice sessions
- **Topic Performance**: Detailed breakdown by topic

### 🎯 Questions Arena (Major & Most Important)
- Browse question sets organized by topic
- Filter by topic and difficulty level
- View progress for each question set
- Start or continue practice sessions

### ✏️ Quiz Page
- Take practice quizzes from selected question sets
- Track time per question
- Use hints when needed
- See explanations after answering
- Track your score and progress

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.tsx      # Main layout with navigation
│   └── Layout.css
├── pages/              # Page components
│   ├── Landing.tsx     # Landing page
│   ├── Dashboard.tsx   # Dashboard page
│   ├── Profile.tsx     # Profile information page
│   ├── Metrics.tsx     # Metrics and analytics page
│   ├── QuestionsArena.tsx  # Questions browsing page
│   └── Quiz.tsx        # Quiz taking page
├── styles/             # Global styles
│   └── theme.css       # Color theme and global styles
├── types/              # TypeScript type definitions
│   └── index.ts
└── App.tsx             # Main app component with routing
```

## Color Theme

The application uses a color scheme inspired by the elevateGRE logo:
- **Navy Blue** (`#1e3a5f`): Primary dark color for text and headers
- **Periwinkle** (`#6b7fd7`): Accent color for buttons and highlights
- **White**: Background and card colors
- **Gray tones**: For borders and secondary elements

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Routing

The application uses React Router with the following routes:

- `/` - Landing page
- `/dashboard` - Dashboard
- `/profile` - Profile information
- `/metrics` - Metrics and analytics
- `/questions` - Questions arena
- `/quiz/:setId` - Quiz page for a specific question set

## Next Steps

### TODO: Backend Integration
- [ ] Connect to backend API for user authentication
- [ ] Fetch real question data from API
- [ ] Save quiz results to backend
- [ ] Fetch user profile data
- [ ] Fetch metrics and analytics data

### TODO: Features
- [ ] User authentication (login/signup)
- [ ] Question search and filtering
- [ ] Bookmark questions
- [ ] Study notes and annotations
- [ ] Practice mode vs. timed mode
- [ ] Detailed analytics charts and graphs
- [ ] Export metrics and progress reports

## Technologies Used

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS** - Styling (with CSS variables for theming)

## License

Private project - All rights reserved
