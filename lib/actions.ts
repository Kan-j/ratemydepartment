"use server"

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
const prisma = new PrismaClient();

export async function getDepartmentDetails(id:number,quarter: number = 0, year: number = 0) {
  try {
    const today = new Date();
    const currentYear = year || today.getFullYear();
    const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3);

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

interface UpdateRatingParams {
  ratingId: number;
  likes: string;
  dislikes: string;
  improvements: string;
  path: string;
}

export async function updateRating({ ratingId, likes, dislikes, improvements, path }: UpdateRatingParams) {
  try {
    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: {
        likes: likes?.trim() || "", // Trim whitespace from likes
        dislikes: dislikes?.trim() || "", // Trim whitespace from dislikes
        improvements: improvements?.trim() || "", // Trim whitespace from improvements
      },
    });

    // Perform any additional actions if necessary, such as revalidating paths
    revalidatePath(path);

    return updatedRating; // Return the updated rating object
  } catch (error: any) {
    console.error(error);
    throw new Error("An error occurred while updating the rating: " + error.message); // Include original error message
  }
}


export async function getDepartmentStatistics(quarter: number = 0, year: number = 0) {
  try {
    const today = new Date();
    const currentYear = year || today.getFullYear();
    const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3); // Calculate current quarter if not provided

    const departments = await prisma.department.findMany({
      where: {
        ratings: {
          some: {
            AND: [
              { year: currentYear },
              { quarter: currentQuarter },
            ],
          },
        },
      },
      include: {
        ratings: {
          where: {
            year: currentYear,
            quarter: currentQuarter,
          },
          select: { stars: true }, // Select necessary fields
        },
      },
    });

    const totalDepartments = departments.length;
    const totalRatings = departments.reduce((acc, department) => acc + department.ratings.length, 0);

    // Calculate highest and lowest rating
    let highestRating = 0;
    let lowestRating = 5;
    departments.forEach(department => {
      department.ratings.forEach(rating => {
        highestRating = Math.max(highestRating, rating.stars);
        lowestRating = Math.min(lowestRating, rating.stars);
      });
    });

    // Set lowestRating to 0 if no ratings exist
    if (totalRatings === 0) {
      lowestRating = 0;
    }
    

    // Calculate average rating for each department and sort departments by average rating
    const departmentAverages = departments.map(department => {
      const totalRatings = department.ratings.length;
      const averageRating =
        totalRatings > 0
          ? parseFloat(
              (
                department.ratings.reduce((sum, rating) => sum + rating.stars, 0) / totalRatings
              ).toFixed(1)
            )
          : 0;
      return { id: department.id, name: department.name, averageRating };
    });

    departmentAverages.sort((a, b) => b.averageRating - a.averageRating);

    return {
      totalDepartments,
      totalRatings,
      highestRating,
      lowestRating,
      departmentAverages,
    };
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred fetching department statistics"); // Re-throw for client-side handling
  }
}

export async function getDepartmentDetailsForAdmin(id: number, quarter: number = 0, year: number = 0) {
  try {
    const today = new Date();
    const currentYear = year || today.getFullYear();
    const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3); // Calculate current quarter if not provided

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        ratings: {
          where: {
            year: currentYear,
            quarter: currentQuarter,
          },
          select: {
            id: true,
            stars: true,
            ratedByUserId: true,
            likes: true,
            dislikes: true,
            improvements: true,
            isPublished: true,
            ratedByUser: {
              select: { id: true, departmentId: true, department: { select: { name: true } } }
            }
          },
        },
      },
    });

    if (!department) {
      return null; // Handle non-existent department
    }

    const totalRatings = department.ratings.length;
    const starsCount = department.ratings.reduce((acc: any, rating: any) => {
      acc[rating.stars] = (acc[rating.stars] || 0) + 1; // Count occurrences of each star rating
      return acc;
    }, {});

    const averageStars =
      totalRatings > 0
        ? parseFloat(
          (
            department.ratings.reduce((sum: number, rating: any) => sum + rating.stars, 0) / totalRatings
          ).toFixed(1)
        )
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

interface TogglePublishedParams {
  ratingIds: number[];
}

export async function toggleRatingPublished({ ratingIds }: TogglePublishedParams) {
  try {
    // Fetch ratings to be updated
    const ratingsToUpdate = await prisma.rating.findMany({
      where: {
        id: { in: ratingIds }, // Filter ratings by provided IDs
      },
    });

    // Toggle isPublished property for each rating
    const updatedRatings = await Promise.all(
      ratingsToUpdate.map(async (rating) => {
        const updatedRating = await prisma.rating.update({
          where: { id: rating.id },
          data: { isPublished: !rating.isPublished }, // Toggle isPublished property
        });
        return updatedRating;
      })
    );

    return updatedRatings; // Return the updated ratings
  } catch (error: any) {
    console.error(error);
    throw new Error("An error occurred while toggling rating published status: " + error.message);
  }
}

