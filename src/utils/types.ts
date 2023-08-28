import { promptGraphMetadataSchema } from "./tsStyles";
import { z } from "zod";

export type Project = {
  name: string;
  industry: string;
  targetAudience: string;
  marketingGoals: string;
  budget: string;
  availableChannels: string;
  competitors: string;
  usp: string;
  additionalInfo: string;
  startDate: Date;
  endDate: Date;
  year: string;
};

export type NodeData = {
  prompt: string;
  isIndependent: boolean;
};

export interface ContentGenerationTask {
  userId: string;
  projectId: string;
  contentType: string;
  metadata: z.infer<typeof promptGraphMetadataSchema>;
}
