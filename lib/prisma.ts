import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {prisma: PrismaClient}

export const prisma = globalForPrisma.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

prisma.$use(async (params, next) => {
    const before = Date.now()
  
    const result = await next(params)
  
    const after = Date.now()
  
    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
    console.log(params)
  
    return result
  })
  

export default prisma