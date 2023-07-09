// import { z } from "zod";
// import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
// import { prisma } from "~/server/db";
// import { checkUserPermission, getUserIdFromRequest } from "../../auth";

// export const postRouter = createTRPCRouter()
//   .mutation("createPost", {
//     input: z.object({
//       projectId: z.string(),
//       content: z.string(),
//     }),
//     async resolve({ input }, { ctx }) {
//       const { projectId, content } = input;

//       // Check user permission using the helper function
//       const userId = await getUserIdFromRequest(ctx.req);
//       await checkUserPermission(userId, projectId);

//       // Create the post in the database
//       const post = await prisma.post.create({
//         data: {
//           content,
//           projectId,
//         },
//       });

//       return post;
//     },
//   })
//   .query("getPostsByProject", {
//     input: z.string(),
//     async resolve({ input }, { ctx }) {
//       const projectId = input;

//       // Check user permission using the helper function
//       const userId = await getUserIdFromRequest(ctx.req);
//       await checkUserPermission(userId, projectId);

//       // Retrieve posts from the database based on the project ID
//       const posts = await prisma.post.findMany({
//         where: {
//           projectId,
//         },
//       });

//       return posts;
//     },
//   })
//   .mutation("editPost", {
//     input: z.object({
//       postId: z.string(),
//       content: z.string(),
//     }),
//     async resolve({ input }, { ctx }) {
//       const { postId, content } = input;

//       // Check user permission using the helper function
//       const userId = await getUserIdFromRequest(ctx.req);
//       const post = await prisma.post.findUnique({
//         where: {
//           id: postId,
//         },
//         select: {
//           projectId: true,
//         },
//       });
//       if (!post || post.project.userId !== userId) {
//         throw new Error("Unauthorized");
//       }

//       // Update the post in the database
//       const updatedPost = await prisma.post.update({
//         where: {
//           id: postId,
//         },
//         data: {
//           content,
//         },
//       });

//       return updatedPost;
//     },
//   })
//   .mutation("deletePost", {
//     input: z.string(),
//     async resolve({ input }, { ctx }) {
//       const postId = input;

//       // Check user permission using the helper function
//       const userId = await getUserIdFromRequest(ctx.req);
//       const post = await prisma.post.findUnique({
//         where: {
//           id: postId,
//         },
//         select: {
//           projectId: true,
//         },
//       });
//       if (!post || post.project.userId !== userId) {
//         throw new Error("Unauthorized");
//       }

//       // Delete the post from the database
//       await prisma.post.delete({
//         where: {
//           id: postId,
//         },
//       });

//       return { success: true };
//     },
//   });
