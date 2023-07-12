import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { Context } from "~/server/api/context";
import { prisma } from "~/server/db";
import { projectSchema } from "../../tsStyles";
import { promptManager } from "../../promptManager/promptManager";
import { aiChatManager } from "../../aiChatManager/aiChatManager";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";

// Create a new ratelimiter, that allows 4 requests per 5 minutes
const postCreationRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "2 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const postRouter = createTRPCRouter({
  // Create a new post
  create: privateProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .mutation(
      ({ input }: { input: { projectId: string } }) =>
        async ({ ctx }: { ctx: Context }) => {
          const userId = (ctx.session as { userId: string }).userId;
          const projectId = input.projectId;

          // Rate limiter
          const { success } = await postCreationRateLimit.limit(userId);
          if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

          // Get the project from the database
          const project = await prisma.project.findUnique({
            where: { id: projectId },
          });

          if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
          }

          // Get the prompt for the "post" node
          const promptNodeId = "post";
          const prompt = await promptManager.getPrompt(promptNodeId, project);

          if (!prompt) {
            throw new Error(`Prompt not found for node ID ${promptNodeId}`);
          }

          // Get the response using AI chat
          const response = await new aiChatManager().getResponse(prompt);

          // Create the post in the database
          const createdPost = await prisma.post.create({
            data: {
              content: response,
              projectId: projectId,
            },
          });

          return createdPost;
        }
    ),
  // Other procedures...
});

export const securedPostRouter = postRouter;
