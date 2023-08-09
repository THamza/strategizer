import Graph from "../graph/graph";
import {
  projectSchema,
  promptGraphMetadataSchema,
  PromptGraphMetadataType,
} from "../../utils/tsStyles";
import { Project, NodeData } from "../../utils/types";
import { formatDateValue } from "../../utils/helpers";

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
    this.createNode("post", process.env.PROMPT_POST!, false);
    this.createNode("context", process.env.PROMPT_PROJECT_CONTEXT!, false);
    this.createNode("video", process.env.PROMPT_VIDEO!, false);
    this.createNode("script", process.env.PROMPT_VIDEO_SCRIPT!, false);
    this.createNode("storyboard", process.env.PROMPT_VIDEO_STORYBOARD!, true);
    this.createNode("seoKeywords", process.env.PROMPT_SEO_KEYWORDS!, false);
    this.createNode("guidance", process.env.PROMPT_GUIDANCE!, false);

    this.createEdge("youAre", "guidance");
    this.createEdge("youAre", "weAre");
    this.createEdge("weAre", "context");
    this.createEdge("context", "video");
    this.createEdge("context", "post");
    this.createEdge("context", "seoKeywords");
    this.createEdge("video", "script");
    this.createEdge("video", "storyboard");
  }

  createNode(nodeId: string, data: string, isIndependent: boolean) {
    this.graph.addNode(nodeId, { prompt: data, isIndependent });
  }

  createEdge(fromNodeId: string, toNodeId: string) {
    this.graph.addEdge(fromNodeId, toNodeId);
  }

  getPrompt(
    nodeId: string,
    project: Project,
    metadata?: PromptGraphMetadataType
  ): string | undefined {
    const shortestPath = this.graph.shortestPath("youAre", nodeId);

    if (!shortestPath) {
      return undefined;
    }

    let aggregatePrompt = "";

    for (const currentNodeId of shortestPath) {
      const nodeData: NodeData | undefined =
        this.graph.getNodeAttributes(currentNodeId);

      if (!nodeData) continue;

      const { prompt, isIndependent } = nodeData;

      const currentProject = {
        ...project,
        year: project.startDate.getFullYear().toString(),
      };

      const updatedPrompt = prompt.replace(
        /<([^>]+)>/g,
        (match: string, placeholder: string): string => {
          // Checking for project properties
          if (placeholder in project) {
            const projectValue = currentProject[placeholder as keyof Project];
            const formattedDate = formatDateValue(projectValue);

            if (formattedDate) {
              return formattedDate;
            } else if (typeof projectValue === "string") {
              return projectValue;
            }
          }
          // Checking for metadata properties
          else if (
            metadata &&
            placeholder in metadata &&
            typeof metadata[placeholder as keyof PromptGraphMetadataType] ===
              "string"
          ) {
            return metadata[placeholder as keyof PromptGraphMetadataType] || "";
          }
          return match;
        }
      );

      if (!isIndependent) {
        aggregatePrompt += updatedPrompt;
      } else {
        aggregatePrompt = updatedPrompt;
        break;
      }
    }

    // Adding guidance element to the prompt
    if (metadata && metadata.guidance) {
      aggregatePrompt +=
        this.graph
          .getNodeAttributes("guidance")
          ?.prompt.replace("<guidance>", metadata.guidance) || "";
    }

    // TODO: handle the special case of SEO keywords. ?

    return aggregatePrompt;
  }
}

const promptManager = new PromptManager();

export { promptManager };
