# LogIt

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.x-orange.svg)](https://firebase.google.com/)

A modern habit tracker and analytics dashboard. Log your daily habits, visualize your progress, and stay motivated with beautiful charts and streaks.

---

## What is LogIt?

LogIt is a full-featured habit tracking app built with:

- **React** frontend (Vite, Tailwind CSS, Framer Motion)
- **Firebase** for authentication and data storage
- **Interactive dashboard** with streaks, heatmaps, and habit analytics

---

## Project Structure

```

logit/
├── frontend/               # React app (main codebase)
│   ├── src/
│   │   ├── components/     # UI components and charts
│   │   ├── context/        # React context (auth, theme)
│   │   ├── pages/          # Dashboard, Stats, etc.
│   │   ├── services/       # Firebase service logic
│   │   └── utils/          # Utility functions
│   ├── public/
│   └── ...
└── ...

````

---

## Features

- **Quick Habit Logging**: One-click daily completion
- **Streaks & Stats**: Track current, best, and total streaks
- **Beautiful Charts**: Weekly heatmap, monthly progress, habit comparison
- **Drag & Drop**: Reorder habits easily
- **Responsive UI**: Works on all devices, light/dark mode
- **Firebase Auth**: Secure Google login

---

## Installation

```bash
cd frontend
npm install
````

---

## Environment Variables

Create a `.env` file in `frontend/`:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

---

## Dashboard Usage

```bash
# Start the app:
npm run dev
```

* Sign in with Google
* Add your first habit
* Log completions, view stats, and track your streaks!

---

## Main Components

* **HabitsList**: Shows all habits, supports drag & drop reordering
* **HabitCard**: Log completion, view streaks, delete habit

### Stats Page:

* **Today’s Progress**: Circular progress for today
* **Weekly Heatmap**: 30-day completion trend
* **Streak Chart**: 30-day streak progression per habit
* **Monthly Progress**: Daily completions for last 30 days
* **Habit Comparison**: Compare habits by streak, total, rate, best

---

## Tech Stack

* **Frontend**: React, Vite, Tailwind CSS, Framer Motion
* **Data**: Firebase Firestore, Firebase Auth

---

## Browser Support

* Chrome 88+
* Firefox 85+
* Safari 14+
* Edge 88+

---

## Support

* **Issues**: [GitHub Issues](https://github.com/romeirofernandes/logit/issues)
* **Docs**: See code comments and UI for guidance

---

## License

MIT License — see [LICENSE](LICENSE) file for details.