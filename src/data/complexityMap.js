export const complexityMap = {
  dijkstra: {
    time: 'O((V + E) log V)',
    space: 'O(V)',
  },

  bellmanford: {
    time: 'O(V * E)',
    space: 'O(V)',
  },

  floydwarshall: {
    time: 'O(V^3)',
    space: 'O(V^3)',
  },

  bfs: {
    time: 'O(V + E)',
    space: 'O(V)',
  },

  dfs: {
    time: 'O(V + E)',
    space: 'O(V)',
  },
}
