type QueueValue = {
  node: string;
  distance: number;
};

class PriorityQueue {
  private values: QueueValue[] = [];

  enqueue(node: string, distance: number): void {
    this.values.push({ node, distance });
    this.bubbleUp();
  }

  private bubbleUp(): void {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    if (!element) return;

    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.values[parentIdx];
      if (!parent) break;

      if (element.distance >= parent.distance) break;

      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }

  dequeue(): string | undefined {
    const min = this.values[0];
    const end = this.values.pop();
    if (!min) return;

    if (this.values.length > 0 && end) {
      this.values[0] = end;
      this.sinkDown();
    }

    return min.node;
  }

  private sinkDown(): void {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    if (!element) return;

    while (true) {
      const leftChildIdx = 2 * idx + 1;
      const rightChildIdx = 2 * idx + 2;
      let swap: number | null = null;

      const leftChild = this.values[leftChildIdx];
      const rightChild = this.values[rightChildIdx];

      if (leftChild && leftChild.distance < element.distance) {
        swap = leftChildIdx;
      }

      if (
        rightChild &&
        ((swap === null && rightChild.distance < element.distance) ||
          (swap !== null &&
            leftChild &&
            rightChild.distance < leftChild.distance))
      ) {
        swap = rightChildIdx;
      }

      if (swap === null) break;

      this.values[idx] = this.values[swap] as QueueValue;
      this.values[swap] = element;
      idx = swap;
    }
  }

  isEmpty(): boolean {
    return this.values.length === 0;
  }
}

export default PriorityQueue;
