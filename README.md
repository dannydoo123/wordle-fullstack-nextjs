# Wordle Fullstack

A fully functional Wordle clone built with Next.js. Features dynamic word validation, hint and challenge modes, a responsive UI, and a lightweight serverless backend for game logic.

---

## Live Demo !!!!

🔗 [Hosted App on Vercel](https://wordle-fullstack-nextjs.vercel.app/)

---

## 🛠️ Tech Stack

**Frontend:**
- **React (JSX)** — Interactive UI components (`Keyboard.js`, `GameBoard.js`, etc.)  
- **JavaScript** — Core app logic and state management  
- **HTML5** — JSX renders semantic structure in the browser  
- **CSS Modules & Plain CSS** — Component styling and layout (`globals.css`, etc.)  
- **Next.js** — React framework with routing, server-side rendering, and API support  

**Backend:**  
- Serverless API routes via Next.js (`/pages/api/`)  
- Handles game logic and serves data dynamically  

---

## Features

- Guess the secret 5-letter word in 6 tries
- Dynamic tile feedback: green (correct), yellow (wrong spot), gray (not in word)
- Hint mode: reveals one correct letter (only usable once)
- Challenge mode: 2-minute countdown, game ends after time runs out
- Toggleable dark mode and sound options

---

## 🧪 Getting Started Locally

Clone and run the app locally:

```bash
git clone https://github.com/dannydoo123/wordle-full
cd wordle-full
npm install next react react-dom axios
npm run dev
