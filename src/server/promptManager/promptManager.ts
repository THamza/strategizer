const { Graph } = require("graphology");
import {
  pomptGraphNodeSchema,
  projectSchema,
  promptGraphMetadataSchema,
} from "../tsStyles";

class PromptManager {
  graph: any;
  constructor() {
    this.graph = new Graph({ directed: true });
    // Initialize and define your graph structure here
    this.initializeGraph();
  }

  initializeGraph() {
    // Nodes
    this.addNode("youAre", process.env.PROMPT_YOU_ARE!);
    this.addNode("weAre", process.env.PROMPT_WE_ARE!);
    this.addNode("task", process.env.PROMPT_TASK!);
    this.addNode("context", process.env.PROMPT_PROJECT_CONTEXT!);
    this.addNode("video", process.env.PROMPT_VIDEO!);
    this.addNode("script", process.env.PROMPT_VIDEO_SCRIPT!);
    this.addNode("storyboard", process.env.PROMPT_VIDEO_STORYBOARD!);
    this.addNode("seoKeywords", process.env.PROMPT_SEO_KEYWORDS!);

    // Edges
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

  async getNode(
    nodeId: string,
    project: typeof projectSchema,
    metadata: typeof promptGraphMetadataSchema
  ) {
    const dfs: any = (currentNodeId: string, aggregatePrompt: string = "") => {
      const nodeData = this.graph.node(currentNodeId);

      if (!nodeData) return undefined;

      const { prompt } = nodeData;

      // Replace all occurrences of placeholders in the prompt with corresponding data
      const updatedPrompt = prompt.replace(
        /<([^>]+)>/g,
        (match: any, placeholder: string) => {
          if (placeholder in project) {
            return project[placeholder as keyof typeof projectSchema];
          } else if (placeholder in metadata) {
            return metadata[
              placeholder as keyof typeof promptGraphMetadataSchema
            ];
          } else {
            return match; // Placeholder not found, keep the original placeholder text
          }
        }
      );

      aggregatePrompt += updatedPrompt;

      if (currentNodeId === nodeId) {
        return aggregatePrompt; // Return the finalized aggregate prompt for the specified node
      }

      const successors = this.graph.successors(currentNodeId);
      for (const successor of successors) {
        const foundNode = dfs(successor, aggregatePrompt);
        if (foundNode) {
          return foundNode;
        }
      }

      return undefined;
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
