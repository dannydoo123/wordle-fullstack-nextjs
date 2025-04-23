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

## 🎮 Features

- Guess the secret 5-letter word in 6 tries
- Dynamic tile feedback: green (correct), yellow (wrong spot), gray (not in word)
- Hint mode: reveals one correct letter (only usable once)
- Challenge mode: 2-minute countdown, game ends after time runs out
- Toggleable dark mode and sound options

---
## 📚 What I Learned

- **Next.js Framework** - Learned to structure a Next.js project using the App Router and utilize features.
- **Serverless Functions** - Built backend API endpoints using Next.js API routes (/pages/api/) that act as serverless functions.
- **State Management with React** - Managed multiple UI states using useState, passing props effectively, and conditionally rendering elements based on user interaction and timer status.
- **Component-Based Design** - Broke down the UI into reusable, functional components (e.g., Navbar, GameBoard, Keyboard, Timer, etc) and styled them using CSS Modules and plain CSS.
- **Frontend Debugging & Error Handling** - Debugged issues related to deployment timing, API responses, incorrect input handling, and rendering mismatches across devices.
- **User Experience Considerations** - Implemented features like dark mode, loading overlays, hint logic, and challenge mode with timers to make the game more interactive and accessible

## 🧪 Getting Started Locally

This project gave me hands-on experience building a fullstack application with modern tools. Throughout the development process, I gained a deeper understanding of:

Clone and run the app locally:

```bash
git clone https://github.com/dannydoo123/wordle-full
cd wordle-full
npm install next react react-dom axios
npm run dev
```
📧 Author
Hyemin Doo
📫 hmdoo0112@gmail.com
🌐 [LinkedIn](https://www.linkedin.com/in/hyemin-doo-b881b3338/)
