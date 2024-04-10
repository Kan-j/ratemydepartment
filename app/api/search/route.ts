
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const term = searchParams.get('term')
  
    try {
      // Query departments based on the search term
      const departments = await prisma.department.findMany({
        where: {
          name: {
            contains: term as string 
          }
        }
      });

      return Response.json({departments})
    } catch (error) {
      console.error('Error searching departments:', error);
      throw new Error(`Error searching for department: ${error}`)
    }
}