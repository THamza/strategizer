/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { projectSchema } from "../../tsStyles";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { projectSchema } from "../../tsStyles";

// Create a new ratelimiter, that allows 4 requests per 5 minutes
const projectCreationRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(4, "5 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const projectRouter = createTRPCRouter({
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    // Get the authenticated user ID from the Clerk context
    const userId = ctx.session.user.id;

    // Rate limiter
    const { success } = await projectCreationRateLimit.limit(userId);
    if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

    // Fetch all projects of the user
    const projects = await ctx.prisma.project.findMany({
      where: {
        userId: userId || undefined,
        isDeleted: false,
      },
      include: {
        posts: {
          select: { id: true },
        },
        Video: {
          select: { id: true },
        },
        seoKeywords: {
          select: { id: true },
        },
      },
    });

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      counts: {
        posts: project.posts.length,
        videos: project.Video.length,
        seoKeywords: project.seoKeywords.length,
      },
    }));
  }),

  create: protectedProcedure.input(projectSchema).mutation(({ ctx, input }) => {
    return ctx.prisma.project.create({
      data: {
        userId: ctx.session.user.id,
        name: input.name,
        industry: input.industry,
        targetAudience: input.targetAudience,
        marketingGoals: input.marketingGoals,
        budget: input.budget,
        availableChannels: input.availableChannels,
        competitors: input.competitors,
        usp: input.usp,
        additionalInfo: input.additionalInfo,
        endDate: input.endDate,
        startDate: input.startDate,
      },
    });
  }),
});
