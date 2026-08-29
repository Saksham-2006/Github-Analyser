# 📊 GitHub Analyser

A modern, high-performance web application designed to turn developer GitHub activity and repository metrics into insightful, visually stunning analytics. Built with **React 19**, **Vite**, **Express**, **Tailwind CSS v4**, **Recharts**, and smooth motion animations.

---

## 🚀 Overview

**GitHub Analyser** provides an intuitive, sleek dashboard to help developers and teams explore contribution patterns, analyze repository statistics, inspect language distributions, and track coding streaks with ease.

---

## 📁 Project Architecture

- **`app/`**: Frontend single-page application built with React, Vite, and Tailwind CSS.
- **`server/`**: Express backend proxying authenticated requests to the GitHub REST API.

---

## 🛠️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [GitHub Personal Access Token](https://github.com/settings/tokens)

---

### 2. Backend Setup (`server`)

1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and set your GitHub token:
     ```env
     GITHUB_TOKEN=your_github_personal_access_token_here
     PORT=5000
     ```

4. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend API will run on `http://localhost:5000`.

---

### 3. Frontend Setup (`app`)

1. Open another terminal and navigate to the app folder:
   ```bash
   cd app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## ✨ Features

- **📈 Developer Overview Dashboard**: Summary of public repos, commits, streaks, and profile details.
- **🔍 Profile Analysis**: Enter any public GitHub username to inspect live metrics.
- **📊 Interactive Charts & Activity Grids**: Heatmaps, contribution trends, active days, and language distributions.
- **📁 Repository Explorer**: Search, filter, and sort repositories with real-time stats.
