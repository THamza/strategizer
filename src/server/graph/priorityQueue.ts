class PriorityQueue {
  nodes: Set<string> = new Set();
  distances: Map<string, number> = new Map();

  enqueue(node: string, distance: number) {
    const existingDistance = this.distances.get(node) || Infinity;
    if (distance < existingDistance) {
      this.distances.set(node, distance);
    }
    this.nodes.add(node);
  }

  dequeue(): string | undefined {
    let minNode: string | undefined;
    let minDistance = Infinity;

    for (const node of this.nodes) {
      const distance = this.distances.get(node) || Infinity;
      console.log("Distances in PQ:", [...this.distances]);

      if (distance < minDistance) {
        minDistance = distance;
        minNode = node;
      }
    }

    if (minNode !== undefined) {
      this.nodes.delete(minNode);
    }

    return minNode;
  }

  isEmpty(): boolean {
    return this.nodes.size === 0;
  }
}

export default PriorityQueue;
