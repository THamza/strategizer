import { projectRouter } from "~/server/api/routers/project";
// import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { promptManager } from "../promptManager/promptManager";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  // post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export { promptManager };
