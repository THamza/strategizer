const { Graph } = require("graphology");

class PromptManager {
  graph: any;
  constructor() {
    this.graph = new Graph({ directed: true });
    // Initialize and define your graph structure here
    this.initializeGraph();
  }

  initializeGraph() {
    this.addNode("youAre", "You are...");
    this.addNode("weAre", "We are...");
    this.addNode("task", "Task...");
    this.addNode("context", "Context...");
    this.addNode("video", "Video...");
    this.addNode("script", "Script...");
    this.addNode("storyboard", "Storyboard...");
    this.addNode("seoKeywords", "SEO Keywords...");
    this.addEdge("youAre", "weAre");
    this.addEdge("weAre", "task");
    this.addEdge("task", "context");
    this.addEdge("context", "video");
    this.addEdge("context", "script");
    this.addEdge("context", "seoKeywords");
    this.addEdge("video", "script");
    this.addEdge("video", "storyboard");
  }

  addNode(nodeId: string, data: string) {
    this.graph.setNode(nodeId, { prompt: data });
  }

  addEdge(fromNodeId: string, toNodeId: string) {
    this.graph.setEdge(fromNodeId, toNodeId);
  }

  async getNode(nodeId: any, project: any, metadata: any) {
    const dfs = (currentNodeId: string) => {
      const nodeData = this.graph.node(currentNodeId);

      if (!nodeData) return undefined;

      const { prompt } = nodeData;

      const graphNode = {
        id: currentNodeId,
        prompt,
        project: project,
        metadata: metadata,
      };

      const successors = this.graph.successors(currentNodeId);
      for (const successor of successors) {
        const foundNode = dfs(successor);
        if (foundNode) {
          return foundNode;
        }
      }

      return graphNode;
    };

    const startNodeId = "youAre"; // Set the starting node ID
    const node = dfs(startNodeId);

    return node;
  }
}

const promptManager = new PromptManager();
// Add nodes and edges to the graph
promptManager.initializeGraph();

export { promptManager };
