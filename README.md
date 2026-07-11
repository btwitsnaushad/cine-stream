# 🎬 Cine-Stream

> A premium, enterprise-grade movie discovery application built with React. Features AI-powered mood matching, infinite scrolling, and highly optimized network requests.

[![Deploy with Vercel](https://vercel.com/button)](https://cine-stream-phi-three.vercel.app)

## 🔗 Live Demo
**[View Live Application Here](https://cine-stream-phi-three.vercel.app)** ---

## ✨ Key Engineering Features

* **🔍 Optimized Debounced Search:** Custom search implementation with a 500ms debounce utility to throttle TMDB API calls and reduce server load.
* **📜 Infinite Scroll Architecture:** Deprecated standard pagination in favor of the native `IntersectionObserver` API for seamless, on-demand data hydration.
* **🧠 AI "Mood Matcher" Integration:** Leverages the **Google Gemini Generative AI** to translate natural language mood descriptions into specific movie recommendations.
* **❤️ State Persistence:** Cross-component favorite state synchronization backed by browser `localStorage` to ensure data survives page reloads.
* **⚡ Asset Optimization:** Enterprise-level image handling using native lazy loading (`loading="lazy"`) to prevent memory leaks during heavy DOM rendering.

---

## 🛠️ Technical Stack

* **Core:** React (via Vite)
* **Styling:** Custom Vanilla CSS (Premium Dark/Cinematic UI Architecture)
* **Data Sources:** TMDB REST API, Google Gemini SDK
* **Hosting/CI-CD:** Vercel

---

## 🚀 Local Development Setup

To run this project locally on your machine, follow these steps:

**1. Clone the repository:**
```bash
git clone [https://github.com/btwitsnaushad/cine-stream.git](https://github.com/btwitsnaushad/cine-stream.git)
cd cine-stream