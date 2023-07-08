import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { Context } from "~/server/api/context";
import { prisma } from "~/server/db";
// import { withAuthentication } from "~/server/api/middleware";
// import { checkUserPermission } from "../../auth";

// Define the project schema using Zod
const projectSchema = z.object({
  name: z.string(),
  industry: z.string(),
  targetAudience: z.string(),
  marketingGoals: z.string(),
  budget: z.number(),
  availableChannels: z.string(),
  competitors: z.string(),
  USP: z.string(),
  additionalInfo: z.string(),
  startDate: z.date(),
  endDate: z.date(),
});

export const projectRouter = createTRPCRouter({
  // Create a new project
  create: privateProcedure
    .input(
      z.object({
        project: projectSchema,
      })
    )
    .mutation(
      ({ input }: { input: { project: (typeof projectSchema)["_type"] } }) =>
        async ({ ctx }: { ctx: Context }) => {
          // Get the authenticated user ID from the Clerk context
          const userId = ctx.session.userId;

          // Create the project in the database
          const createdProject = await prisma.project.create({
            data: {
              ...input.project, // Spread the project properties
              userId,
            },
          });

          return createdProject;
        }
    ),

  // Edit a project
  edit: privateProcedure
    .input(
      z.object({
        projectId: z.string(),
        project: projectSchema,
      })
    )
    .mutation(
      ({
          input,
        }: {
          input: {
            project: (typeof projectSchema)["_type"];
            projectId: string;
          };
        }) =>
        async ({ ctx }: { ctx: Context }) => {
          const { projectId } = input;
          console.log(projectId);
          // Update the project in the database
          const updatedProject = await prisma.project.update({
            where: {
              id: projectId,
            },
            data: input,
          });

          return updatedProject;
        }
    ),

  // // Get all user projects
  // getProjects: privateProcedure
  //   .input(z.string())
  //   .query(async ({ ctx }: { ctx: Context }) => {
  //     const

  //     // Retrieve the project and related posts from the database
  //     const project = await prisma.project.findUnique({
  //       where: {
  //         userId: "jlkn",
  //       },
  //       include: {
  //         posts: true,
  //       },
  //     });

  //     return project;
  //   }),
});

// Wrap the project router with authentication middleware
// export const securedProjectRouter = checkUserPermission(projectRouter);
export const securedProjectRouter = projectRouter;
