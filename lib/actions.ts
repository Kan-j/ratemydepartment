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
      ? (parseFloat((department.ratings.reduce((sum, rating) => sum + rating.stars, 0) / totalRatings).toString())).toFixed(2)
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


// export async function getDepartmentStatistics(quarter: number = 0, year: number = 0) {
//   try {
//     const today = new Date();
//     const currentYear = year || today.getFullYear();
//     const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3); // Calculate current quarter if not provided

//     const departments = await prisma.department.findMany({
//       where: {
//         ratings: {
//           some: {
//             AND: [
//               { year: currentYear },
//               { quarter: currentQuarter },
//             ],
//           },
//         },
//       },
//       include: {
//         ratings: {
//           where: {
//             year: currentYear,
//             quarter: currentQuarter,
//           },
//           select: { stars: true }, // Select necessary fields
//         },
//       },
//     });

//     const totalDepartments = departments.length;
//     const totalRatings = departments.reduce((acc, department) => acc + department.ratings.length, 0);

//     // Calculate highest and lowest rating
//     let highestRating = 0;
//     let lowestRating = 5;
//     departments.forEach(department => {
//       department.ratings.forEach(rating => {
//         highestRating = Math.max(highestRating, rating.stars);
//         lowestRating = Math.min(lowestRating, rating.stars);
//       });
//     });

//     // Set lowestRating to 0 if no ratings exist
//     if (totalRatings === 0) {
//       lowestRating = 0;
//     }
    

//     // Calculate average rating for each department and sort departments by average rating
//     const departmentAverages = departments.map(department => {
//       const totalRatings = department.ratings.length;
//       const averageRating =
//         totalRatings > 0
//           ? parseFloat(
//               (
//                 department.ratings.reduce((sum, rating) => sum + rating.stars, 0) / totalRatings
//               ).toFixed(2)
//             )
//           : 0;
//       return { id: department.id, name: department.name, averageRating };
//     });

//     departmentAverages.sort((a, b) => b.averageRating - a.averageRating);

//     // Calculate overall average of all department average ratings
//     const overallAverageRating =
//       departmentAverages.length > 0
//         ? parseFloat(
//             (
//               departmentAverages.reduce((sum, department) => sum + department.averageRating, 0) / departmentAverages.length
//             ).toFixed(2)
//           )
//         : 0;

//     return {
//       totalDepartments,
//       totalRatings,
//       highestRating,
//       lowestRating,
//       overallAverageRating,
//       departmentAverages,
//     };
//   } catch (error) {
//     console.error(error);
//     throw new Error("An error occurred fetching department statistics"); // Re-throw for client-side handling
//   }
// }
export async function getDepartmentStatistics(quarter = 0, year = 0) {
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
              ).toFixed(2)
            )
          : 0;
      return { id: department.id, name: department.name, averageRating };
    });

    departmentAverages.sort((a, b) => b.averageRating - a.averageRating);

    // Calculate overall average of all department average ratings
    const overallAverageRating =
      departmentAverages.length > 0
        ? parseFloat(
            (
              departmentAverages.reduce((sum, department) => sum + department.averageRating, 0) / departmentAverages.length
            ).toFixed(2)
          )
        : 0;

     // Upsert department rankings
     for (const department of departmentAverages) {
      const existingRanking = await prisma.departmentRanking.findFirst({
        where: {
            departmentId: department.id,
            year: currentYear,
            quarter: currentQuarter,
        },
      });

      if (existingRanking) {
        await prisma.departmentRanking.update({
          where: {
            id: existingRanking.id,
          },
          data: {
            averageRating: department.averageRating,
            // isPublished: false, // or true depending on your logic
          },
        });
      } else {
        await prisma.departmentRanking.create({
          data: {
            departmentId: department.id,
            averageRating: department.averageRating,
            isPublished: false, // or true depending on your logic
            year: currentYear,
            quarter: currentQuarter,
          },
        });
      }
    }

    
    return {
      totalDepartments,
      totalRatings,
      highestRating,
      lowestRating,
      overallAverageRating,
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
            year:true,
            quarter:true,
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
          ).toFixed(2)
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

interface GetDepartmentRankingDataParams {
  quarter?: number;
  year?: number;
  departmentId?: number;
}

// export async function getDepartmentRankingData({ quarter = 0, year = 0, departmentId }: GetDepartmentRankingDataParams) {
//   try {
//     const today = new Date();
//     const currentYear = year || today.getFullYear();
//     const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3);

//     // Fetch only published department rankings for the specified or current year and quarter
//     const departmentRankings = await prisma.departmentRanking.findMany({
//       where: {
//         year: currentYear,
//         quarter: currentQuarter,
//         isPublished: true,
//       },
//       include: {
//         department: true,
//       },
//       orderBy: {
//         averageRating: 'desc',
//       },
//     });

//     if (departmentRankings.length === 0) {
//       return {
//         corporateScore:0,
//         highestAverageRating:0,
//         lowestAverageRating:0,
//         departmentRankings:[],
//         departmentAverageRating:0
//       }
//     }

//     // Calculate the corporate score (average of all scores)
//     const totalScore = departmentRankings.reduce((sum, ranking) => sum + ranking.averageRating, 0);
//     const corporateScore = parseFloat((totalScore / departmentRankings.length).toFixed(2));

//     // Determine the highest and lowest average ratings
//     const highestAverageRating = departmentRankings[0].averageRating;
//     const lowestAverageRating = departmentRankings[departmentRankings.length - 1].averageRating;

//     // Get the average rating of the specified department, if departmentId is provided
//     let departmentAverageRating = null;
//     if (departmentId) {
//       const departmentRanking = departmentRankings.find(ranking => ranking.departmentId === departmentId);
//       if (departmentRanking) {
//         departmentAverageRating = departmentRanking.averageRating;
//       } else {
//         throw new Error('Specified department has no published rankings for the specified period.');
//       }
//     }

//     return {
//       departmentRankings,
//       corporateScore,
//       highestAverageRating,
//       lowestAverageRating,
//       departmentAverageRating,
//     };
//   } catch (error) {
//     console.error(error);
//     throw new Error('An error occurred fetching department ranking data');
//   }
// }

export async function getDepartmentRankingData(quarter = 0, year = 0, departmentId:any) {
  try {
    const today = new Date();
    const currentYear = year || today.getFullYear();
    const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3);

    // Fetch only published department rankings for the specified or current year and quarter
    const departmentRankings = await prisma.departmentRanking.findMany({
      where: {
        year: currentYear,
        quarter: currentQuarter,
        isPublished: true,
      },
      include: {
        department: true,
      },
      orderBy: {
        averageRating: 'desc',
      },
    });

    if (departmentRankings.length === 0) {
      return {
        corporateScore: 0,
        highestAverageRating: 0,
        lowestAverageRating: 0,
        departmentRankings: [],
        departmentAverageRating: 0,
      };
    }

    // Map to the desired structure
    const formattedRankings = departmentRankings.map(ranking => ({
      id: ranking.id,
      name: ranking.department.name,
      averageRating: ranking.averageRating,
      departmentId : ranking.departmentId
    }));

    // Calculate the corporate score (average of all scores)
    const totalScore = formattedRankings.reduce((sum, ranking) => sum + ranking.averageRating, 0);
    const corporateScore = parseFloat((totalScore / formattedRankings.length).toFixed(2));

    // Determine the highest and lowest average ratings
    const highestAverageRating = formattedRankings[0].averageRating;
    const lowestAverageRating = formattedRankings[formattedRankings.length - 1].averageRating;

    // Get the average rating of the specified department, if departmentId is provided
    let departmentAverageRating = 0;
    if (departmentId) {
      const departmentRanking = formattedRankings.find(ranking => ranking.departmentId === departmentId);
      if (departmentRanking) {
        departmentAverageRating = departmentRanking.averageRating;
      } else {
        throw new Error('Specified department has no published rankings for the specified period.');
      }
    }

    return {
      departmentRankings: formattedRankings,
      corporateScore,
      highestAverageRating,
      lowestAverageRating,
      departmentAverageRating,
    };
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred fetching department ranking data');
  }
}






// Get the IDs of the Department Ranking
export async function getDepartmentRankingIds( quarter = 0, year = 0 ) {
  try {
    const today = new Date();
    const currentYear = year || today.getFullYear();
    const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3);

    // Fetch IDs of department rankings for the specified or current year and quarter
    const departmentRankingIds = await prisma.departmentRanking.findMany({
      where: {
        year: currentYear,
        quarter: currentQuarter,
      },
      select: {
        id: true,
      },
    });

    if (departmentRankingIds.length === 0) {
      return departmentRankingIds;
    }
  

    return departmentRankingIds.map(ranking => ranking.id) 
    
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred fetching department ranking IDs');
  }
}


interface TogglePublishedStatusParams {
  departmentRankingIds: number[];
}

export async function togglePublishedStatus({ departmentRankingIds }: TogglePublishedStatusParams) {
  try {
    // Fetch the current isPublished status of the given IDs
    const rankings = await prisma.departmentRanking.findMany({
      where: {
        id: {
          in: departmentRankingIds,
        },
      },
      select: {
        id: true,
        isPublished: true,
      },
    });

    if (rankings.length === 0) {
      throw new Error('No department rankings found for the provided IDs.');
    }

    // Toggle the isPublished status
    const updatedRankings = await Promise.all(
      rankings.map(async (ranking) => {
        return prisma.departmentRanking.update({
          where: { id: ranking.id },
          data: { isPublished: !ranking.isPublished },
        });
      })
    );

    return {
      updatedRankings,
    };
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while toggling the published status');
  }
}

export async function getPublishedState({ departmentRankingIds }: { departmentRankingIds: number[] }) {
  try {
    const rankings = await prisma.departmentRanking.findMany({
      where: {
        id: {
          in: departmentRankingIds,
        },
      },
      select: {
        id: true,
        isPublished: true,
      },
    });

    return {
      rankings,
    };
  } catch (error) {
    console.error('Error fetching published state:', error);
    throw new Error('An error occurred fetching the published state');
  }
}

export async function getCommentsPublishedState( {ratingIds}:{ratingIds: number[]}) {
  try {
    const ratings = await prisma.rating.findMany({
      where: {
        id: {
          in: ratingIds,
        },
      },
      select: {
        id: true,
        isPublished: true,
      },
    });

    return { ratings };
  } catch (error) {
    console.error('Error fetching published state:', error);
    throw new Error('Error fetching published state');
  }
}


export async function getRatingsForTheQuarterAndYear(quarter: number,year: number) {
  try {
    const ratings = await prisma.rating.findMany({
      where: {
        year,
      },
      include: {
        department: true,
        ratedByUser: {
          include: {
            department: true,
          },
        },
      },
    });

    const transformedRatings= ratings.map(rating => ({
      "Department Rated": rating.department.name,
      "Rater": rating.ratedByUser.name,
      "Rater's Department": rating.ratedByUser.department.name,
      "likes": rating.likes,
      "dislikes": rating.dislikes,
      "improvement": rating.improvements,
      "Stars rating": rating.stars,
      "quarter": rating.quarter,
      "year": rating.year,
    }));

    return transformedRatings;
  } catch (error) {
    console.error('Error fetching ratings for the year:', error);
    throw new Error('An error occurred while fetching ratings for the specified year');
  }
}

export async function getRatingsForYear(year: number) {
  try {
    const ratings = await prisma.rating.findMany({
      where: {
        year,
      },
      include: {
        department: true,
        ratedByUser: {
          include: {
            department: true,
          },
        },
      },
    });

    const transformedRatings= ratings.map(rating => ({
      "Department Rated": rating.department.name,
      "Rater": rating.ratedByUser.name,
      "Rater's Department": rating.ratedByUser.department.name,
      "likes": rating.likes,
      "dislikes": rating.dislikes,
      "improvement": rating.improvements,
      "Stars rating": rating.stars,
      "quarter": rating.quarter,
      "year": rating.year,
    }));

    return transformedRatings;
  } catch (error) {
    console.error('Error fetching ratings for the year:', error);
    throw new Error('An error occurred while fetching ratings for the specified year');
  }
}