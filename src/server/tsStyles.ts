import { z } from "zod";

const projectSchema = z.object({
  name: z.string(),
  industry: z.string(),
  targetAudience: z.string(),
  marketingGoals: z.string(),
  budget: z.string(),
  availableChannels: z.string(),
  competitors: z.string(),
  USP: z.string(),
  additionalInfo: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

const promptGraphMetadataSchema = z.object({
  socialMediaPlatform: z.string() || null, // Used for generating posts
  videoLength: z.string() || null, // user for generating video content
  field: z.string() || null, // used for generating seo keywords
});

const pomptGraphNodeSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  project: projectSchema,
  metadata: promptGraphMetadataSchema,
});

export { projectSchema, promptGraphMetadataSchema, pomptGraphNodeSchema };
