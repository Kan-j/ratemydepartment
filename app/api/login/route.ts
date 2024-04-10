import prisma from "@/lib/prisma";
import crypto from 'crypto'

interface RequestBody {
    email: string;
    password: string
}

export async function POST(request: Request){
    const body:RequestBody = await request.json()

    const user = await prisma.user.findFirst({
        where:{
            email: body.email
        }
    })


    if (user) {
        // Hash the password entered by the user
        // const hashedPassword = crypto.createHash('sha256').update(body.password).digest('hex');
        // Compare the hashed password with the hashed password stored in the user object
        if (body.password === user.password) {
            // If passwords match, return the user object without the password
            const { password, ...userWithoutPass } = user;
            return new Response(JSON.stringify(userWithoutPass));
        } else {
            // If passwords don't match, return null
            return new Response(JSON.stringify(null));
        }
    } else {
        // If user is not found, return null
        return new Response(JSON.stringify(null));
    }
}