import { SessionContext } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

export type Context = {
  session: SessionContext;
  prisma: PrismaClient;
};
