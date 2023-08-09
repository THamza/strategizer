import { createTRPCRouter } from "./trpc";
import { projectRouter } from "./routers/project";
import { postRouter } from "./routers/post";
import { seoKeywordsRouter } from "./routers/seoKeywords";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  post: postRouter,
  seoKeywords: seoKeywordsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
