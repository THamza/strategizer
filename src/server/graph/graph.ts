import PriorityQueue from "./priorityQueue";
import { NodeData } from "../../utils/types";

class Graph {
  nodes: Map<string, NodeData> = new Map();
  edges: Map<string, Set<string>> = new Map();

  addNode(nodeId: string, data: NodeData) {
    if (!this.nodes.has(nodeId)) {
      this.nodes.set(nodeId, data);
      this.edges.set(nodeId, new Set());
    }
  }

  addEdge(fromNodeId: string, toNodeId: string) {
    if (this.nodes.has(fromNodeId) && this.nodes.has(toNodeId)) {
      this.edges.get(fromNodeId)?.add(toNodeId);
      //   this.edges.get(toNodeId)?.add(fromNodeId); // Since it's undirected
    }
  }

  getNodeAttributes(nodeId: string): NodeData | undefined {
    return this.nodes.get(nodeId);
  }

  getAdjacentNodes(nodeId: string): Set<string> | undefined {
    return this.edges.get(nodeId);
  }

  shortestPath(sourceNodeId: string, targetNodeId: string): string[] | null {
    const distances: Map<string, number> = new Map();
    const previousNodes: Map<string, string | null> = new Map();
    const pq: PriorityQueue = new PriorityQueue();

    // Initializing distance to every node as Infinity and source node's distance as 0
    for (const nodeId of this.nodes.keys()) {
      if (nodeId === sourceNodeId) {
        distances.set(nodeId, 0);
        pq.enqueue(nodeId, 0);
      } else {
        distances.set(nodeId, Infinity);
      }
      previousNodes.set(nodeId, null);
    }

    while (!pq.isEmpty()) {
      const currentNode = pq.dequeue();

      // if the currentNode is undefined, then there's something wrong
      if (!currentNode) continue;

      if (currentNode === targetNodeId) {
        const path: string[] = [];
        let current = currentNode;

        while (current !== sourceNodeId) {
          path.unshift(current);
          current = previousNodes.get(current) || sourceNodeId;
        }
        path.unshift(sourceNodeId);

        return path;
      }

      const neighbors = this.edges.get(currentNode) || new Set();
      for (const neighbor of neighbors) {
        const alt = (distances.get(currentNode) || 0) + 1; // Since weight is 1 for all edges
        if (alt < (distances.get(neighbor) || Infinity)) {
          distances.set(neighbor, alt);
          previousNodes.set(neighbor, currentNode);
          pq.enqueue(neighbor, alt); // Update the priority queue with the new distance
        }
      }
    }

    return null; // path not found
  }
}

export default Graph;
