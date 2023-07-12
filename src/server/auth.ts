// import Clerk from "@clerk/nextjs"
// import { TRPCError } from "@trpc/server";
// import { Context } from "~/server/api/context";
// import { prisma } from "~/server/db";

// const clerk = new Clerk({ secretKey: process.env.CLERK_API_KEY });

// export async function getUserIdFromRequest(req: any): Promise<string | null> {
//   try {
//     const sessionToken = req.headers.authorization.split("Bearer ")[1];
//     const session = await clerk.verifyToken(sessionToken);
//     return session.sub;
//   } catch {
//     return null;
//   }
// }

// export const checkUserPermission = async (
//   req: any,
//   projectId: string
// ): Promise<void> => {
//   const userId = await getUserIdFromRequest(req);

//   if (!userId) {
//     throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
//   }

//   const project = await prisma.project.findUnique({
//     where: {
//       id: projectId,
//     },
//   });

//   if (!project || project.userId !== userId) {
//     throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
//   }
// };
