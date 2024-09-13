import { getServerSession } from "next-auth";
import { sessionNamespace } from "../prisma";

export async function initializeSession() {
    const session = await getServerSession();
    sessionNamespace.run(() => {
      sessionNamespace.set('session', session);
    });
  }