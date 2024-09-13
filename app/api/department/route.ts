
import { prisma} from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
  
    try {
      // Find user by email
      if(email) {
        const user = await prisma.user.findUnique({
            where: { email },
            // Select specific fields to exclude password
            select: { id: true, isAdmin:true, email: true, departmentId: true, name: true} // Add other relevant fields as needed }
          });
          if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 });
          }
      
          return Response.json({ user });
      }

      return Response.json({ message: "Email not found"});
      
    } catch (error) {
      console.error('Error fetching user or department:', error);
      return Response.json({ error: 'An error occurred' }, { status: 500 });
    }
  }
