# 🔍 Intelligent Algorithm Visualizer

An interactive web-based platform to visualize popular algorithms with step-by-step animations. This project also includes an AI-powered recommender system that analyzes user-provided problems and suggests the most suitable algorithm based on complexity and context.

---

## 🚀 Features

### 🔎 **Searching Algorithms**
- **Linear Search**
- **Binary Search**

### 📊 **Sorting Algorithms**
- **Bubble Sort**
- **Insertion Sort**
- **Quick Sort**
- **Merge Sort**

### 🌐 **Graph & Traversal Algorithms**
- **Depth-First Search (DFS)**
- **Breadth-First Search (BFS)**

### ⭐ **Pathfinding Algorithms**
- **A* Search Algorithm**
- **Dijkstra's Algorithm**

### ♟️ **Backtracking Algorithms**
- **N-Queens Problem**
- **Maze Solver**

### 🧠 **AI-Powered Recommender**
- Accepts user-defined problem statements and complexity constraints  
- Recommends the most suitable algorithm (e.g., A* for pathfinding, Merge Sort for large unsorted arrays)  
- Displays reasoning behind the suggestion

### 🧩 **Miscellaneous Algorithms**
- **Graph Coloring**  
  Colors vertices of a graph so that no two adjacent nodes share the same color using greedy/backtracking techniques.

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
## 👩‍💻 Authors

- Md Nahid Hasan — 221002339  
- Asma Akter — 221002531  
- Hasimunnahar Shanta — 221002585

**Course**: Integrated Design Project II (CSE-406)  
**Instructor**: Md. Ataullha Saim
**University**: Green University of Bangladesh

---

## 📜 License

This project is for academic and educational use.
