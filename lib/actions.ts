"use server"

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
const prisma = new PrismaClient();

export async function getDepartmentDetails(id:number) {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentQuarter = Math.ceil((today.getMonth() + 1) / 3); // Calculate current quarter

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        ratings: {
          where: {
            year: currentYear,
            quarter: currentQuarter,
          },
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

interface Params{
  departmentId: number,
  stars: number,
  likes: string,
  dislikes: string,
  improvements: string
  userId: number,
  path: string
}

export async function createRating({departmentId, stars, likes, dislikes, improvements, userId, path}: Params) {

  const today = new Date(); // Get the current date

  try {
    // Basic validation
    if (stars < 1 || stars > 5) {
      throw new Error("Invalid star rating. Please enter a value between 1 and 5.");
    }

    // Get current year and calculate quarter
    const year = today.getFullYear(); // Assign current year
    const quarter = Math.ceil((today.getMonth() + 1) / 3); // Calculate quarter (1-4)

    const newRating = await prisma.rating.create({
      data: {
        departmentId,
        stars,
        likes: likes?.trim() || "", // Trim whitespace from likes
        dislikes: dislikes?.trim() || "", // Trim whitespace from dislikes
        improvements: improvements?.trim() || "", // Trim whitespace from improvements
        quarter,
        year,
        ratedByUserId: userId, // Set the user who submitted the rating
      },
    });

    revalidatePath(path)
    return newRating; // Return the created rating object
  } catch (error:any) {
    console.error(error);
    throw new Error("An error occurred while creating the rating: " + error.message); // Include original error message
  } 
}