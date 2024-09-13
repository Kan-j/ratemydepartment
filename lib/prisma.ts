import { PrismaClient } from "@prisma/client";
import { createNamespace } from 'cls-hooked';

const globalForPrisma = global as unknown as {prisma: PrismaClient}

const prisma = globalForPrisma.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const sessionNamespace = createNamespace('session');

function getSessionFromContext() {
  return sessionNamespace.get('session');
}

prisma.$use(async (params, next) => {
    const session = sessionNamespace.get('session');
    if(session){
      console.log(session, params)
      const before = Date.now()
  
      const result = await next(params)
    
      const after = Date.now()
      console.log(result)
      return result
    }
   
  
    const result = await next(params)
  

    // console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
    // console.log(params)
  
    return result
    
  })
  


// export default prisma
export { prisma, sessionNamespace,getSessionFromContext };