// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getFormatedProject } from "../../../utils/helpers";
import { promptGraphMetadataSchema } from "../../../utils/tsStyles";
import { ContentGenerationTask } from "../../../utils/types";
import { connectRabbitMQ } from "../../../utils/jobQueue/amqpConnection";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { AiChatManager } from "../../aiChatManager/aiChatManager";

import { promptManager } from "../../promptManager/promptManager";
import { RabbitMQManager } from "../../../utils/jobQueue/RabbitMQManager";

const queueName = "POST_GENERATION_QUEUE";

// Create a new ratelimiter, that allows 4 requests per 5 minutes
const postCreationRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const postRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Find the project first to make sure it belongs to the user
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
      });

      if (!project || project.userId !== userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No such project found for the current user.",
        });
      }

      // Then, fetch all posts for the project
      const posts = await ctx.prisma.post.findMany({
        where: {
          projectId: input.projectId,
        },
      });

      return posts;
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        socialMediaPlatform: z.string(),
        guidance: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const channel = RabbitMQManager.getChannel();

      // Rate limiter
      if (process.env.RATE_LIMITER_ENABLED === "true") {
        const { success } = await postCreationRateLimit.limit(userId);
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      const metadata = {
        socialMediaPlatform: input.socialMediaPlatform,
        guidance: input.guidance,
        videoLength: "",
        videoScript: "",
        field: "",
        year: "",
      };

      const postGenerationTask: ContentGenerationTask = {
        userId,
        projectId: input.projectId,
        contentType: "Post",
        metadata,
      };

      channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(postGenerationTask))
      );

      return {
        success: false,
      };
    }),
});
