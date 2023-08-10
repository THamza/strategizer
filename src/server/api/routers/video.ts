import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getFormatedProject } from "../../../utils/helpers";
import { promptGraphMetadataSchema } from "../../../utils/tsStyles";
import { AiChatManager } from "../../aiChatManager/aiChatManager";
import { promptManager } from "../../promptManager/promptManager";

export const videoRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Fetching videos for the project
      const videos = await ctx.prisma.video.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          scripts: true,
          storyboards: true,
        },
      });

      // Transform the result to the desired format
      const formattedVideos = videos.map((video) => ({
        id: video.id,
        projectId: video.projectId,
        scripts: video.scripts,
        storyboards: video.storyboards,
        length: video.length,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      }));

      return formattedVideos;
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        guidance: z.string(),
        videoLength: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Validate the project
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
        socialMediaPlatform: "",
        guidance: input.guidance,
        videoLength: input.videoLength,
        videoScript: "",
        field: "",
        year: "",
      };

      const scriptPrompt = promptManager.getPrompt(
        "script",
        getFormatedProject(project),
        promptGraphMetadataSchema.parse(metadata)
      );

      const aiChatManager = new AiChatManager();
      const scriptContent = await aiChatManager.getResponse(scriptPrompt || "");

      metadata.videoScript = scriptContent;

      const storyboardPrompt = promptManager.getPrompt(
        "storyboard",
        getFormatedProject(project),
        promptGraphMetadataSchema.parse(metadata)
      );

      const storyboardContent = await aiChatManager.getResponse(
        storyboardPrompt || ""
      );

      const createdVideo = await ctx.prisma.video.create({
        data: {
          projectId: input.projectId,
          length: isNaN(parseInt(input.videoLength, 10))
            ? 0
            : parseInt(input.videoLength, 10),
          scripts: {
            create: {
              content: scriptContent,
            },
          },
          storyboards: {
            create: {
              content: storyboardContent,
            },
          },
        },
      });

      return {
        success: true,
        video: createdVideo,
      };
    }),
});
