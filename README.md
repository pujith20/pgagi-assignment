# Personalized Content Dashboard 🚀

A fully responsive, interactive, and dynamic content dashboard built with **React**, **Next.js**, **TypeScript**, **Redux Toolkit**, and **Tailwind CSS**. This application offers users personalized content feeds including news, recommendations, and social posts, with rich UI/UX features like dark mode, drag-and-drop, and advanced search.

---

## 📝 Table of Contents

- [📸 Demo](#-demo)
- [🚀 Features](#-features)
- [⚙️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🔧 Setup Instructions](#-setup-instructions)
- [🧪 Testing](#-testing)
- [📦 API Used](#-api-used)
- [🎥 Demo Video](#-demo-video)
- [🌐 Live Link](#-live-link)

---

## 📸 Demo

![Dashboard Preview](./public/demo-preview.png)  
*(Add screenshots or GIFs here)*

---

## 🚀 Features

### 🔹 Core Functionality

- **Personalized Content Feed**
  - User-configurable preferences stored in `Redux` + `localStorage`
  - Fetches dynamic content from:
    - News API (e.g., NewsAPI)
    - Recommendations API (e.g., TMDB)
    - Mock Social Media API

- **Content Cards**
  - Interactive, animated cards for each item
  - Support for infinite scrolling and pagination
  - "Read More" / "Play Now" buttons

- **Favorites**
  - Mark and view your favorite content

- **Trending Section**
  - Displays top news, movies, or posts across categories

- **Search**
  - Global search with debounced results
  - Filters across categories: news, movies, social

### 🎨 Advanced UI/UX

- Responsive Sidebar + Header Layout
- **Drag-and-Drop** content reordering (using `Framer Motion`)
- **Dark Mode** toggle with Tailwind theming
- Smooth animations & transitions
- Loading spinners & hover effects

---

## ⚙️ Tech Stack

| Technology        | Purpose                          |
|-------------------|----------------------------------|
| React + Next.js   | Frontend Framework               |
| TypeScript        | Type Safety                      |
| Tailwind CSS      | Styling                          |
| Redux Toolkit     | State Management                 |
| RTK Query         | API Integration                  |
| Framer Motion     | Animations & Drag-and-Drop       |
| React Testing Library | Unit & Integration Testing  |
| Cypress           | End-to-End Testing               |

---

## 📂 Project Structure

src/
│
├── components/ # UI Components (cards, sections, layout)
├── sections/ # Home, Search, Trending, Favorites
├── store/ # Redux slices and API services
├── hooks/ # Custom hooks
├── types/ # Global TypeScript types
├── utils/ # Utility functions
├── pages/ # Next.js pages


---

## 🔧 Setup Instructions

### 1. Clone the Repository


git clone https://github.com/pujith20/pgagi_Assignment.git
cd pgagi_Assignment


### 2. Install Dependencies

npm install
# or
yarn install


### 3. Run the App

npm run dev
# or
yarn dev

### 4. Build for Production

npm run build
npm start

📦 API Used
NewsAPI – For latest news articles

TMDB API – For movie recommendations

Mock Social Media API – Simulated social content using static JSON or mock services

🎥 Demo Video
Click here to watch the demo
(Upload to YouTube or Google Drive and paste the link)

🌐 Live Link
Click here to visit the app
(Deploy using Vercel, Netlify, or similar)

🧠 Author
Naga Pujith Kumar Pamujula
Frontend Developer | TypeScript + React Enthusiast
📧 pamujulapujith.15@gmail.com
