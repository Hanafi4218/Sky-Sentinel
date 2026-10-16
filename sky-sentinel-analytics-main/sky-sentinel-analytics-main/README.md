# SkySentinel Analytics 🛡️🌤️

A real-time weather risk assessment system using **Fuzzy Logic** for drone operation safety in Malaysia. Built with React, TypeScript, and Vite.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🎯 Overview

SkySentinel Analytics is an intelligent weather monitoring dashboard that evaluates environmental conditions using a **27-rule Fuzzy Inference System**. It processes three key inputs—wind speed, humidity, and temperature—to calculate a risk percentage and determine operational status for drone flights.

## ✨ Features

### 🔴 Live Sentinel
- Real-time weather monitoring across 6 Malaysian stations
- Automatic risk assessment with visual gauges
- Connection status indicator

### 🎮 Simulator
- Interactive sliders to simulate weather conditions
- Side-by-side comparison with live data
- Critical alert system with Telegram notifications

### 🧪 The Lab
- Visualize fuzzy membership functions
- Explore the 27-rule knowledge base
- Understand fuzzification, inference, and defuzzification

### 📚 Documentation
- Complete system architecture explanation
- Fuzzy logic methodology breakdown
- Technical implementation details

## 🧠 Fuzzy Logic Engine

The system uses a Mamdani-type fuzzy inference system with:

### Input Variables
| Variable | Low | Medium | High |
|----------|-----|--------|------|
| Wind Speed (km/h) | 0-10 | 8-25 | 20-60+ |
| Humidity (%) | 0-40 | 30-70 | 60-100 |
| Temperature (°C) | 0-22 | 20-32 | 30-45+ |

### Output Status
- **Stable** (0-35%): Safe for operations
- **Caution** (35-70%): Proceed with care
- **Critical** (70-100%): Ground all drones

### Process Flow
1. **Fuzzification** - Convert crisp inputs to fuzzy membership values
2. **Rule Evaluation** - Apply 27 IF-THEN rules using MIN operator
3. **Aggregation** - Combine rules using MAX operator
4. **Defuzzification** - Calculate weighted average for final risk percentage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/LuqmanNurhakimRosli/sky-sentinel-analytics.git

# Navigate to project directory
cd sky-sentinel-analytics

# Install dependencies
npm install
# or
bun install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
# or
bun dev
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Telegram Bot Configuration (for critical alerts)
VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
VITE_TELEGRAM_CHAT_ID=your_chat_id_here

# AccuWeather API (optional - uses mock data if not set)
# VITE_ACCUWEATHER_API_KEY=your_api_key_here
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── GlassPanel.tsx  # Glassmorphism container
│   ├── RiskGauge.tsx   # Circular risk indicator
│   ├── HudSlider.tsx   # Custom slider component
│   └── ...
├── pages/              # Main application pages
│   ├── LiveSentinel.tsx
│   ├── Simulator.tsx
│   ├── TheLab.tsx
│   └── Documentation.tsx
├── utils/
│   ├── fuzzyEngine.ts  # Core fuzzy logic implementation
│   ├── weatherApi.ts   # Weather data fetching
│   └── telegramService.ts # Alert notifications
├── hooks/              # Custom React hooks
└── lib/                # Utility functions
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## 🌍 Monitored Stations

| Station | Location | AccuWeather Key |
|---------|----------|-----------------|
| Putrajaya | W.P. Putrajaya | 235400 |
| Kuala Lumpur | Subang | 48647 |
| Penang | Bayan Lepas | 229893 |
| Johor Bahru | Senai | 228029 |
| Kuching | Sarawak | 230204 |
| Kota Kinabalu | Sabah | 229992 |

## 📱 Telegram Alerts

When conditions reach **Critical** status, the system can send real-time alerts to a configured Telegram chat:

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Get your chat ID via [@userinfobot](https://t.me/userinfobot)
3. Add credentials to `.env`

## 🧪 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **State Management**: TanStack Query
- **Testing**: Vitest

## 📄 License

This project is for educational purposes - demonstrating fuzzy logic applications in real-world scenarios.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with 💙 for safer drone operations in Malaysia**
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
