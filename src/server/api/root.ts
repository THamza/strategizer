import { createTRPCRouter } from "./trpc";
import { projectRouter } from "./routers/project";
import { postRouter } from "./routers/post";
import { seoKeywordsRouter } from "./routers/seoKeywords";
import { videoRouter } from "./routers/video";
import { RabbitMQManager } from "../../utils/jobQueue/RabbitMQManager";

async function initialize() {
  try {
    await RabbitMQManager.initialize();
    // Initialize other parts of your app here, like your tRPC server
  } catch (error) {
    console.error("Failed to initialize RabbitMQ:", error);
    process.exit(1); // Exit the process as RabbitMQ is essential
  }
}

void initialize();

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  project: projectRouter,
  post: postRouter,
  seoKeywords: seoKeywordsRouter,
  video: videoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
