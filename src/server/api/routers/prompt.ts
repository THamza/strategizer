import { z } from "zod";
import { createRouter, inferRouter, TRPCError } from "trpc";
import { Context } from "~/server/api/context";
import { prisma } from "~/server/api/prisma";
import { withAuthentication } from "~/server/api/middleware";

// Define the prompt schema using Zod
const promptSchema = z.object({
  query: z.string(),
  type: z.string(),
  // ... add other properties here
});

// Define the API router
export const promptRouter = createRouter()
  // Create a new prompt
  .mutation("createPrompt", {
    input: promptSchema,
    async resolve(
      { input }: { input: (typeof promptSchema)["_type"] },
      { ctx }: { ctx: Context }
    ) {
      // Get the authenticated user ID from the Clerk context
      const userId = ctx.session.userId;

      // Create the prompt in the database
      const createdPrompt = await prisma.prompt.create({
        data: {
          ...input,
          userId,
        },
      });

      return createdPrompt;
    },
  })
  // Get all prompts of the connected user
  .query("getPrompts", {
    async resolve({ ctx }: { ctx: Context }) {
      // Get the authenticated user ID from the Clerk context
      const userId = ctx.session.userId;

      // Retrieve prompts from the database based on the user ID
      const prompts = await prisma.prompt.findMany({
        where: {
          userId,
        },
      });

      return prompts;
    },
  })
  // Edit a prompt
  .mutation("editPrompt", {
    input: z.object({
      promptId: z.string(),
      ...promptSchema.shape, // Include all properties for editing
    }),
    async resolve(
      {
        input,
      }: { input: { promptId: string } & (typeof promptSchema)["_type"] },
      { ctx }: { ctx: Context }
    ) {
      const { promptId, ...updatedFields } = input;

      // Update the prompt in the database
      const updatedPrompt = await prisma.prompt.update({
        where: {
          id: promptId,
        },
        data: updatedFields,
      });

      return updatedPrompt;
    },
  })
  // Delete a prompt
  .mutation("deletePrompt", {
    input: z.string(),
    async resolve({ input }: { input: string }, { ctx }: { ctx: Context }) {
      const promptId = input;

      // Delete the prompt from the database
      await prisma.prompt.delete({
        where: {
          id: promptId,
        },
      });

      return true;
    },
  });

// Wrap the prompt router with authentication middleware
export const securedPromptRouter = withAuthentication(promptRouter);

// Infer the types for the prompt router
export type PromptRouter = typeof promptRouter;
export type SecuredPromptRouter = typeof securedPromptRouter &
  inferRouter<PromptRouter>;
