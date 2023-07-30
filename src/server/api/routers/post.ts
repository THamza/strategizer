import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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
        content: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

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

      const post = await ctx.prisma.post.create({
        data: {
          content: input.content,
          projectId: input.projectId,
        },
      });

      console.log("Post created:", post);

      return {
        success: true,
      };
    }),
});
