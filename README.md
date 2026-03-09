<p align="center">
  <img src="public/logo.png" alt="AlgoScope Logo" width="300px">
</p>

# AlgoScope — Algorithm Visualizer

AlgoScope is a modern, interactive web application designed to demystify complex algorithms and data structures through real-time, high-fidelity visualizations. Built with **React 19**, **Framer Motion**, and **Anime.js**, AlgoScope transforms abstract logic into fluid animations, making the learning process intuitive, engaging, and accessible.

---

## 💡 Problem Statement

Learning Data Structures and Algorithms (DSA) is often a daunting task for students and developers. Traditional resources like static pseudocode, textbooks, and static diagrams fail to capture the dynamic nature of algorithms. This lack of visual context makes it difficult to understand:
- How pointers move during tree traversals.
- How elements are swapped in real-time during sorting.
- How paths are expanded in graph-based shortest-path algorithms.

AlgoScope bridges this gap by providing a hands-on environment where users can watch the flow behind every operation, helping them build a mental model of how algorithms actually work.

---

## ✨ Features

- **Real-time Visualization:** Watch algorithms come alive with smooth, step-by-step animations.
- **Adjustable Control:** Full control over animation speed and input data to learn at your own pace.
- **Algorithm Coverage:** 
  - **Sorting:** Bubble Sort, Merge Sort, Quick Sort, and more.
  - **Searching:** Linear Search and Binary Search on arrays.
  - **Graph Algorithms:** BFS, DFS, Dijkstra, Floyd-Warshall, and Topological Sort.
  - **ADTs (Beta):** Stacks, Queues, and Linked Lists.
- **Code Insights:** See the actual implementation in multiple programming languages alongside the visualization.
- **Interactive Playground:** Create custom inputs, change array sizes, and interact directly with the canvas.

---

## 🛠️ Tech Stack

- **Frontend Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [Material UI](https://mui.com/), [Flowbite React](https://flowbite-react.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/), [Anime.js](https://animejs.com/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Syntax Highlighting:** [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)

---

## 🚀 Installation

Follow these steps to set up AlgoScope locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bim-adi/AlgoScope.git
   cd AlgoScope
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View in Browser:**
   Open `http://localhost:5173` to see AlgoScope in action.

---

## 📖 Usage

1. **Landing Page:** Explore the various categories of algorithms (Sorting, Searching, Graphs, etc.).
2. **Select Category:** Click on a card (e.g., "Sorting") to enter the specialized visualizer page.
3. **Configure:** Use the top menu or sidebar to select a specific algorithm (e.g., "Quick Sort").
4. **Interact:**
   - Adjust the **Speed Slider** to slow down or speed up the visualization.
   - Use the **Input Controls** to generate random data or provide your own.
   - Click **Start** to begin the visualization and watch the algorithm in action!

---

## 📂 Project Structure

```text
AlgoScope/
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── sortingAlgo/       # Sorting visualizer logic & components
│   │   ├── searchAlgo/        # Graph searching (BFS/DFS) logic
│   │   ├── arraySearch/       # Linear/Binary search logic
│   │   ├── shortestPathAlgo/  # Dijkstra/Floyd-Warshall logic
│   │   ├── dataStructures/    # Stacks, Queues, and Trees (ADT)
│   │   └── about/             # About page and author profiles
│   ├── assets/                # Images, icons, and static assets
│   ├── lib/                   # Utility functions
│   ├── App.jsx                # Main routing and entry component
│   └── main.jsx               # React DOM rendering
├── public/                    # Static public assets (Logo, etc.)
├── vite.config.js             # Vite configuration
└── tailwind.config.js         # Tailwind CSS configuration
```

---

## 🔮 Future Improvements

- [ ] **Advanced Data Structures:** Add visualizations for AVL Trees, Red-Black Trees, and Heaps.
- [ ] **Complex Graphs:** Implement visualizations for Minimum Spanning Trees (Prim’s, Kruskal’s).
- [ ] **Complexity Analysis:** Display real-time Time and Space complexity metrics for each algorithm.
- [ ] **Quiz Mode:** Interactive challenges to test user knowledge of algorithm steps.
- [ ] **Dark/Light Mode:** Full theming support for comfortable viewing in any environment.

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for new visualizations or improvements, please follow these steps:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information (or assume standard open-source terms).

---

## 👨‍💻 Authors

**Aditya Paul**  
- GitHub: [@adityapaul26](https://github.com/adityapaul26)  
- LinkedIn: [aditya-paul-b8881a31b](https://linkedin.com/in/aditya-paul-b8881a31b/)

**Bratik Mukherjee**  
- GitHub: [@Bimbok](https://github.com/Bimbok)  
- LinkedIn: [bratik-mukherjee](https://linkedin.com/in/bratik-mukherjee)

---
<p align="center">Made with ❤️ for the DSA community.</p>
