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

import { AiChatManager } from "../../aiChatManager/aiChatManager";

import { promptManager } from "../../promptManager/promptManager";

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

      // Get the response using AI chat
      const responseString = await new AiChatManager().getResponse(prompt);

      let response;
      try {
        response = JSON.parse(responseString);
      } catch (error) {
        throw new Error("Failed to parse the response: " + error);
      }

      // Validate the response structure
      if (!Array.isArray(response)) {
        throw new Error(
          "Invalid response format: Expected an array of objects."
        );
      }

      let seoKeywordsList: string[] = [];

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
          throw new Error(
            "Invalid response format: Each object should have a 'keyword' (string) and a 'pertinence' (number between 1 to 10) property."
          );
        }

        await ctx.prisma.seoKeyword.create({
          data: {
            keyword: item.keyword,
            pertinence: item.pertinence,
            projectId: input.projectId,
          },
        });

        seoKeywordsList.push(item.keyword);
      }

      return {
        success: true,
        seoKeywords: seoKeywordsList,
      };
    }),
});