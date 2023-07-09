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
  socialMediaPlatform: z.string() || null, // used for generating posts
  videoLength: z.string() || null, // used for generating video content
  videoScript: z.string() || null, // user to generate a storyboard
  field: z.string() || null, // used for generating seo keywords
  year: z.string() || null,
});

const pomptGraphNodeSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  isIndependant: z.boolean(),
  //   project: projectSchema,
  //   metadata: promptGraphMetadataSchema,
});

export { projectSchema, promptGraphMetadataSchema, pomptGraphNodeSchema };
