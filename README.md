# 📈 Signalist

Signalist is a stock market intelligence platform that helps investors discover, analyze, and track stocks through personalized watchlists, real-time market data, interactive TradingView charts, and automated news summaries.

Built with Next.js, TypeScript, MongoDB, Better Auth, Inngest, Gemini AI, and TradingView.

---

## Features

### Authentication & User Management

- Secure authentication with Better Auth
- Sign Up and Sign In flows
- Personalized onboarding experience
- Session-based route protection

---

### Smart Stock Search

- Search stocks using Finnhub API
- Debounced search for improved performance
- Popular stock recommendations
- Keyboard shortcut support (Ctrl/Cmd + K)
- Quick navigation to stock detail pages

---

### Personalized Watchlists

- Add stocks to watchlist
- Remove stocks from watchlist
- Persistent MongoDB storage
- User-specific watchlists
- Watchlist dashboard

---

### Stock Analysis Dashboard

Each stock page includes:

- Symbol Overview Widget
- Advanced Candlestick Charts
- Baseline Charts
- Technical Analysis Indicators
- Company Profile Widget
- Financial Statements Widget

Powered by TradingView.

---

### Personalized Market News

Signalist fetches market news using Finnhub and:

- Prioritizes stocks in the user's watchlist
- Falls back to general market news when needed
- Filters and formats news articles
- Generates concise investor-friendly summaries

---

### AI-Powered News Summaries

Using Google Gemini:

- Summarizes multiple financial news articles
- Creates readable market insights
- Generates personalized daily updates
- Reduces information overload for investors

---

### Automated Email System

Built with Nodemailer and Inngest.

#### Welcome Emails

- Automatically sent after registration
- Personalized using user preferences

#### Daily News Summaries

- Scheduled via cron jobs
- Personalized using watchlist stocks
- AI-generated summaries delivered directly to inboxes

---

### Background Workflows

Powered by Inngest.

Current workflows:

- User welcome email workflow
- Daily market summary workflow
- AI content generation workflow
- Scheduled cron execution

---

### Modern UI/UX

- Dark-themed interface
- Responsive design
- Smooth hover effects
- Interactive search modal
- Trading dashboard experience

---

## Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

### Backend

- Next.js Server Actions
- MongoDB
- Mongoose

### Authentication

- Better Auth

### APIs

- Finnhub API
- TradingView Widgets
- Gemini API

### Background Jobs

- Inngest

### Email Services

- Nodemailer

---

## Project Structure

```text
app/
├── (auth)
│   ├── sign-in
│   └── sign-up
│
├── (root)
│   ├── stocks/[symbol]
│   ├── watchlist
│   └── page.tsx
│
├── api/inngest
│
└── database
    ├── models
    └── mongoose.ts

components/
├── forms
├── ui
├── Header.tsx
├── SearchCommand.tsx
├── TradingViewWidget.tsx
├── UserDropdown.tsx
└── WatchlistButton.tsx

hooks/
├── useDebounce.ts
└── useTradingViewWidget.ts

lib/
├── actions
├── better-auth
├── inngest
├── nodemailer
├── constants.ts
└── utils.ts
```

---

## Environment Variables

Create a `.env` file:

```env
# MongoDB
MONGODB_URI=

# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# Finnhub
FINNHUB_API_KEY=

# Gemini
GEMINI_API_KEY=

# Email
EMAIL_USER=
EMAIL_PASSWORD=
```

---

## Installation

Clone repository:

```bash
git clone https://github.com/05-Jagritii/stock-app.git
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Start Inngest:

```bash
npx inngest-cli dev
```

---

## Future Roadmap

- Real-time stock alerts
- Portfolio management
- AI investment recommendations
- Sentiment analysis
- Stock comparison tools
- Multi-market support
- Mobile application
