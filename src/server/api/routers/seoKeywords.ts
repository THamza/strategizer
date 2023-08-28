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
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { AiChatManager } from "../../aiChatManager/aiChatManager";

import { promptManager } from "../../promptManager/promptManager";

// Create a new ratelimiter, that allows 4 requests per 5 minutes
const seoKeywordsCreationRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "5 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const seoKeywordsRouter = createTRPCRouter({
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

      // Then, fetch all seoKeywords for the project
      const seoKeywords = await ctx.prisma.seoKeyword.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          pertinence: "desc",
        },
      });

      return seoKeywords;
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        guidance: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Rate limiter
      if (process.env.RATE_LIMITER_ENABLED === "true") {
        const { success } = await seoKeywordsCreationRateLimit.limit(userId);
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      console.log("userId:", userId);
      // Check if the project belongs to the user before
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
      });

      if (!project || project.userId !== userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No such project found for the current user.",
        });
      }

      const metadata = {
        guidance: input.guidance,
        socialMediaPlatform: "",
        videoLength: "",
        videoScript: "",
        field: "",
        year: "",
      };

      const prompt = promptManager.getPrompt(
        "seoKeywords",
        getFormatedProject(project),
        promptGraphMetadataSchema.parse(metadata)
      );

      if (!prompt) {
        return {
          success: false,
          seoKeywords: null,
        };
      }

      // Run AI chat and Prisma operations asynchronously
      new AiChatManager()
        .getResponse(prompt)
        .then((responseString) => {
          let response;
          try {
            response = JSON.parse(responseString);
          } catch (error) {
            console.error("Failed to parse the response:", error);
            return;
          }

          if (!Array.isArray(response)) {
            console.error(
              "Invalid response format: Expected an array of objects."
            );
            return;
          }

          for (const item of response) {
            if (
              typeof item !== "object" ||
              !item.hasOwnProperty("keyword") ||
              typeof item.keyword !== "string" ||
              !item.hasOwnProperty("pertinence") ||
              typeof item.pertinence !== "number" ||
              item.pertinence < 1 ||
              item.pertinence > 10
            ) {
              console.error(
                "Invalid response format: Each object should have a 'keyword' (string) and a 'pertinence' (number between 1 to 10) property."
              );
              return;
            }

            ctx.prisma.seoKeyword
              .create({
                data: {
                  keyword: item.keyword,
                  pertinence: item.pertinence,
                  projectId: input.projectId,
                },
              })
              .catch((error) => {
                console.error("Failed to create SEO keyword:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Failed to get AI response:", error);
        });

      return {
        success: true,
      };
    }),
});
