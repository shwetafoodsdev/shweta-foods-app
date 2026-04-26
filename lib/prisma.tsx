import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  const useAccelerate =
    url?.startsWith("prisma+postgres://") || url?.startsWith("prisma://");

  if (useAccelerate) {
    return new PrismaClient({ log: ["error"] }).$extends(withAccelerate());
  }

  return new PrismaClient({
    log: ["error"],
  });
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = createPrismaClient();
}

export const prisma = globalForPrisma.prisma;