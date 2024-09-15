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

   // Skip logging for AuditTrailLog model to prevent an infinite loop


  // Proceed only if a session exists
  if (session) {
    if (params.model === 'AuditTrailLog') {
      return next(params); // Skip the middleware and proceed with the next step
    }

    const user = session.user;
    const before = Date.now();
    const actionType = params.action; // Action type being performed (e.g., 'findMany', 'create', etc.)
    const actionDetails = JSON.stringify({
      ...params.args, // Spread the arguments of the query/action
    });


    // Proceed with the actual Prisma operation
    const result = await next(params);
    const after = Date.now();
   
    (async () => {
      try {
        await prisma.auditTrailLog.create({
          data: {
            userName: user.name, // or get the user from session
            userEmail: user.email,
            actionType: actionType,
            model: params.model ?? 'Admin',
            actionDetails: `${actionDetails}`, // Log the query args
            timestamp: new Date(after), // Log the time of action
          },
        });
      } catch (logError) {
        console.error('Failed to log action:', logError); // Handle logging errors
      }
    })();

    
    return result; // Return the result of the operation
  }

  // If no session exists, just proceed with the next middleware or Prisma operation
  return next(params);
});


// export default prisma
export { prisma, sessionNamespace,getSessionFromContext };