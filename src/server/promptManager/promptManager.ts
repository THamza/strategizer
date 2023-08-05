import Graph from "graphology";
import { projectSchema, promptGraphMetadataSchema } from "../tsStyles";

class PromptManager {
  graph: Graph;

  constructor() {
    this.graph = new Graph();
    this.initializeGraph();
  }

  initializeGraph() {
    this.createNode("youAre", process.env.PROMPT_YOU_ARE!, false);
    this.createNode("weAre", process.env.PROMPT_WE_ARE!, false);
    this.createNode("post", process.env.PROMPT_POST!, false);
    this.createNode("context", process.env.PROMPT_PROJECT_CONTEXT!, false);
    this.createNode("video", process.env.PROMPT_VIDEO!, false);
    this.createNode("script", process.env.PROMPT_VIDEO_SCRIPT!, false);
    this.createNode("storyboard", process.env.PROMPT_VIDEO_STORYBOARD!, true);
    this.createNode("seoKeywords", process.env.PROMPT_SEO_KEYWORDS!, false);

    this.createEdge("youAre", "weAre");
    this.createEdge("weAre", "post");
    this.createEdge("post", "context");
    this.createEdge("context", "video");
    this.createEdge("context", "script");
    this.createEdge("context", "seoKeywords");
    this.createEdge("video", "script");
    this.createEdge("video", "storyboard");
  }

  createNode(nodeId: string, data: string, isIndependent: boolean) {
    this.graph.addNode(nodeId, { prompt: data, isIndependent });
  }

  createEdge(fromNodeId: string, toNodeId: string) {
    this.graph.addUndirectedEdge(fromNodeId, toNodeId);
  }

  getPrompt(
    nodeId: string,
    project: typeof projectSchema,
    metadata?: typeof promptGraphMetadataSchema
  ): string | undefined {
    const shortestPath = this.graph.shortestPath("youAre", nodeId);

    if (!shortestPath) {
      return undefined;
    }

    let aggregatePrompt = "";

    for (const currentNodeId of shortestPath) {
      const nodeData = this.graph.getNodeAttributes(currentNodeId);

      if (!nodeData) continue;

      const { prompt, isIndependent } = nodeData;

      const updatedPrompt = prompt.replace(
        /<([^>]+)>/g,
        (match: string, placeholder: string) => {
          if (placeholder in project) {
            return project[placeholder as keyof typeof projectSchema];
          } else if (metadata !== undefined && placeholder in metadata) {
            return metadata[
              placeholder as keyof typeof promptGraphMetadataSchema
            ];
          } else {
            return match;
          }
        }
      );

      if (!isIndependent) {
        aggregatePrompt += updatedPrompt;
      } else {
        aggregatePrompt = updatedPrompt as string;
        break;
      }
    }

    // TODO: handle the special case of SEO keywords

    return aggregatePrompt;
  }
}

const promptManager = new PromptManager();

export { promptManager };
