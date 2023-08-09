import { z } from "zod";

const projectSchema = z.object({
  name: z.string(),
  industry: z.string(),
  targetAudience: z.string(),
  marketingGoals: z.string(),
  budget: z.string(),
  availableChannels: z.string(),
  competitors: z.string(),
  usp: z.string(),
  additionalInfo: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

const promptGraphMetadataSchema = z.object({
  socialMediaPlatform: z.string().nullable(), // used for generating posts
  videoLength: z.string().nullable(), // used for generating video content
  videoScript: z.string().nullable(), // user to generate a storyboard
  field: z.string().nullable(), // used for generating seo keywords
  year: z.string().nullable(),
  guidance: z.string().nullable(),
});

export type PromptGraphMetadataType = z.infer<typeof promptGraphMetadataSchema>;

export { projectSchema, promptGraphMetadataSchema };
