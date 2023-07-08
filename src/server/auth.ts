import { Clerk } from "@clerk/clerk-sdk-node";

const clerk = new Clerk({ apiKey: process.env.CLERK_API_KEY });

export async function getUserIdFromRequest(req: any): Promise<string | null> {
  try {
    const sessionToken = req.headers.authorization.split("Bearer ")[1];
    const session = await clerk.verifyToken(sessionToken);
    return session.sub;
  } catch {
    return null;
  }
}
