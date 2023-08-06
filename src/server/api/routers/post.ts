// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { projectSchema } from "../../../utils/tsStyles";
import { Project } from "../../../utils/types";
import { promptGraphMetadataSchema } from "../../../utils/tsStyles";

// import { aiChatManager } from "../../aiChatManager/AiChatManager";

import { promptManager } from "../../promptManager/promptManager";

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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      console.log("userId:", userId);
      // Check if the project belongs to the user before creating a post
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
      });

      if (!project || project.userId !== userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No such project found for the current user.",
        });
      }

      const formattedProject = {
        name: project.name,
        industry: project.industry,
        targetAudience: project.targetAudience,
        marketingGoals: project.marketingGoals,
        budget: project.budget,
        availableChannels: project.availableChannels,
        competitors: project.competitors,
        usp: project.usp,
        additionalInfo: project.additionalInfo,
        startDate: z.date().parse(project.startDate), // Convert to ZodDate
        endDate: z.date().parse(project.endDate), // Convert to ZodDate
      };

      console.log("formattedProject:", formattedProject);

      const validatedProject: Project = projectSchema.parse(
        formattedProject
      ) as Project;

      const metadata = {
        socialMediaPlatform: input.socialMediaPlatform,
        videoLength: "",
        videoScript: "",
        field: "",
        year: "",
      };

      const parsedMetadata = promptGraphMetadataSchema.parse(metadata);

      const promptNodeId = "post";
      const prompt = promptManager.getPrompt(
        promptNodeId,
        validatedProject,
        parsedMetadata
      );

      console.log("prompt:", prompt);
      let temPrompt = prompt || "";
      if (!prompt) {
        temPrompt = "No prompt found :(";
      }

      // Get the response using AI chat
      // const response = await new aiChatManager().getResponse(prompt);

      // console.log("response GPT:", response);
      const post = await ctx.prisma.post.create({
        data: {
          content: temPrompt,
          projectId: input.projectId,
        },
      });

      return {
        success: true,
        post: post,
      };
    }),
});
