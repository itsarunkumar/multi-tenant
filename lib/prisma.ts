import { PrismaClient } from "@prisma/client";

declare global {
  // This avoids TypeScript errors for augmenting the global object
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma; // Only assign to global in non-production environments
}

export default prisma;
