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
    this.createNode("youAre", process.env.PROMPT_YOU_ARE!, false);
    this.createNode("weAre", process.env.PROMPT_WE_ARE!, false);
    this.createNode("post", process.env.PROMPT_POST!, false);
    this.createNode("context", process.env.PROMPT_PROJECT_CONTEXT!, false);
    this.createNode("video", process.env.PROMPT_VIDEO!, false);
    this.createNode("script", process.env.PROMPT_VIDEO_SCRIPT!, false);
    this.createNode("storyboard", process.env.PROMPT_VIDEO_STORYBOARD!, true);
    this.createNode("seoKeywords", process.env.PROMPT_SEO_KEYWORDS!, false);

    // Edges
    this.createEdge("youAre", "weAre");
    this.createEdge("weAre", "post");
    this.createEdge("post", "context");
    this.createEdge("context", "video");
    this.createEdge("context", "script");
    this.createEdge("context", "seoKeywords");
    this.createEdge("video", "script");
    this.createEdge("video", "storyboard");
  }

  createNode(nodeId: string, data: string, isIndependant: boolean) {
    this.graph.addNode(nodeId, { prompt: data, isIndependant });
  }

  createEdge(fromNodeId: string, toNodeId: string) {
    this.graph.addEdge(fromNodeId, toNodeId);
  }

  async getNode(
    nodeId: string,
    project: typeof projectSchema,
    metadata: typeof promptGraphMetadataSchema
  ) {
    const dfs: any = (currentNodeId: string, aggregatePrompt: string = "") => {
      const nodeData = this.graph.node(currentNodeId);

      if (!nodeData) return undefined;

      const { prompt, isIndependant } = nodeData;

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

      if (!isIndependant) {
        aggregatePrompt += updatedPrompt;
      } else {
        /* It means that:
            - This node must be a leaf
            - We are only interested in its own prompt only */
        aggregatePrompt = updatedPrompt;
      }

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

export { promptManager };
