# 🔍 Intelligent Algorithm Visualizer

An interactive web-based platform to visualize popular algorithms with step-by-step animations. This project also includes an AI-powered recommender system that analyzes user-provided problems and suggests the most suitable algorithm based on complexity and context.

---

## 🚀 Features

- 🔎 **Search Algorithms**  
  Visualizes Linear Search and Binary Search with index tracking and comparison steps.

- 📊 **Sorting Algorithms**  
  Includes Bubble Sort with animated comparisons and swap tracking.

- 🧠 **AI-Powered Recommender**  
  Takes user-defined problems and recommends the most suitable algorithm based on type and complexity.

- 🌐 **Graph Algorithms**  
  Visualizes DFS and BFS using node-by-node traversal in graph structures.

- ⭐ **Pathfinding Algorithm**  
  A* search algorithm visualized in a 2D grid with cost updates and shortest path finding.

- ♟️ **Backtracking**  
  Solves the N-Queens problem with recursive placement and backtracking steps.

---

## 🧩 System Design Overview

- **Block Diagram**  
  High-level architecture showing interaction among components: UI, AI Recommender, Visualization Engine, Database.

- **Data Flow Diagrams (DFDs)**  
  - **Level 0 (Context)**: Shows flow between User, System, and Database.  
  - **Level 1**: Breaks down the AI Recommendation module (Feature Extraction, Algorithm Matching).

- **Use-Case Diagram**  
  Models user interactions like: Sign Up, Login, Submit Problem, View Visualization, Comment, Leaderboard.

- **Class Diagram**  
  Shows system structure and classes: `User`, `Algorithm`, `AIEngine`, `VisualizationEngine`, `DatabaseManager`.

- **Sequence Diagram**  
  Represents user-system interactions for:
  - Login/Signup
  - Algorithm Request
  - AI Recommendation
  - Leaderboard Access
  - Comment System

---

## ⚙️ Technologies Used

- **Frontend**: HTML, CSS, JavaScript  
- **Backend (Optional)**: Python / Node.js  
- **AI Recommender**: Rule-based or trained logic  
- **Storage**: Local data or basic database for user records

---

## 📂 Project Structure

/intelligent-algorithm-visualizer
├── index.html
├── styles/
│ └── main.css
├── scripts/
│ ├── visualizer.js
│ ├── recommender.js
│ └── utils.js
├── assets/
│ └── icons, images
├── README.md

---

## 👩‍💻 Authors

- Md Nahid Hasan — 221002339  
- Asma Akter — 221002531  
- Hasimunnahar Shanta — 221002585

**Course**: Integrated Design Project II (CSE-406)  
**Instructor**: Md. Ataullha  
**University**: Green University of Bangladesh

---

## 📜 License

This project is for academic and educational use.
