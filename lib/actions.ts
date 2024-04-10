"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getDepartmentDetails(id:number) {
  try {
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        ratings: {
          select: { id: true, stars: true }, // Select necessary fields
        },
      },
    });

    if (!department) {
      return null; // Handle non-existent department
    }

    const totalRatings = department.ratings.length;
    const starsCount = department.ratings.reduce((acc:any, rating:any) => {
      acc[rating.stars] = (acc[rating.stars] || 0) + 1; // Count occurrences of each star rating
      return acc;
    }, {});

    const averageStars =
    totalRatings > 0
      ? (parseFloat((department.ratings.reduce((sum, rating) => sum + rating.stars, 0) / totalRatings).toString())).toFixed(1)
      : 0.0; 
    

    return {
      department,
      totalRatings,
      starsCount,
      averageStars
    };
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred fetching department details"); // Re-throw for client-side handling
  }
}