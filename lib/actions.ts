"use server"

// import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {prisma, sessionNamespace} from "./prisma";
import axios from 'axios';
import path from 'path';
import { promises as fs, createWriteStream } from 'fs';
import { getServerSession } from "next-auth";
import { Buffer } from 'buffer';

export async function getSession() {
  try {
    // Fetch the session data asynchronously
    const session = await getServerSession();
    // Ensure that session is properly returned
    if (!session) {
      throw new Error('Session not found');
    }
    return {...session.user};
  } catch (error) {
    console.error('Failed to get session:', error);
    throw new Error('Failed to get session');
  }
}

export async function getUserDepartment() {
  try {
    // Fetch the session data
    const session = await getServerSession();
    if (!session) {
      throw new Error('Session not found');
    }

    const email = session?.user?.email;
    if (!email) {
      throw new Error('User email not found in session');
    }

    // Fetch user department data from the API
    const response = await fetch(`http://127.0.0.1:3000/api/department?email=${email}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch department data: ${response.statusText}`);
    }

    const userDetails = await response.json();
    if (!userDetails.user || !userDetails.user.departmentId) {
      throw new Error('Department ID not found in the response');
    }

    const { departmentId } = userDetails.user;
    return departmentId;

  } catch (error:any) {
    console.error('Failed to get user department:', error);
    throw new Error(`An error occurred while fetching the user department: ${error.message}`);
  }
}


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





interface UpdateRatingParams {
  ratingId: number;
  likes: string;
  dislikes: string;
  improvements: string;
  path: string;
}

// export async function updateRating({ ratingId, likes, dislikes, improvements, path }: UpdateRatingParams) {
//   try {
//     const updatedRating = await prisma.rating.update({
//       where: { id: ratingId },
//       data: {
//         likes: likes?.trim() || "", // Trim whitespace from likes
//         dislikes: dislikes?.trim() || "", // Trim whitespace from dislikes
//         improvements: improvements?.trim() || "", // Trim whitespace from improvements
//       },
//     });

//     // Perform any additional actions if necessary, such as revalidating paths
//     revalidatePath(path);

//     return updatedRating; // Return the updated rating object
//   } catch (error: any) {
//     console.error(error);
//     throw new Error("An error occurred while updating the rating: " + error.message); // Include original error message
//   }
// }


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
// export async function getDepartmentStatistics(quarter = 0, year = 0) {
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

//      // Upsert department rankings
//      for (const department of departmentAverages) {
//       const existingRanking = await prisma.departmentRanking.findFirst({
//         where: {
//             departmentId: department.id,
//             year: currentYear,
//             quarter: currentQuarter,
//         },
//       });

//       if (existingRanking) {
//         await prisma.departmentRanking.update({
//           where: {
//             id: existingRanking.id,
//           },
//           data: {
//             averageRating: department.averageRating,
//             // isPublished: false, // or true depending on your logic
//           },
//         });
//       } else {
//         await prisma.departmentRanking.create({
//           data: {
//             departmentId: department.id,
//             averageRating: department.averageRating,
//             isPublished: false, // or true depending on your logic
//             year: currentYear,
//             quarter: currentQuarter,
//           },
//         });
//       }
//     }

    
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

interface DepartmentStatistics {
  totalDepartments: number;       // Total number of departments considered
  totalRatings: number;           // Total number of ratings for all departments
  highestRating: number;          // The highest star rating given to any department
  lowestRating: number;           // The lowest star rating given to any department
  overallAverageRating: number;   // The overall average star rating across all departments
  departmentAverages: any; // List of departments with their respective average ratings
}


export async function getDepartmentStatistics(quarter = 0, year = 0): Promise<DepartmentStatistics> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set the session inside the namespace
        const session = await getSession();
        sessionNamespace.set("session", { user: session });

        const today = new Date();
        const currentYear = year || today.getFullYear();
        const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3); // Calculate current quarter if not provided

        const departments = await prisma.department.findMany({
          where: {
            ratings: {
              some: {
                AND: [{ year: currentYear }, { quarter: currentQuarter }],
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
        departments.forEach((department) => {
          department.ratings.forEach((rating) => {
            highestRating = Math.max(highestRating, rating.stars);
            lowestRating = Math.min(lowestRating, rating.stars);
          });
        });

        // Set lowestRating to 0 if no ratings exist
        if (totalRatings === 0) {
          lowestRating = 0;
        }

        // Calculate average rating for each department and sort departments by average rating
        const departmentAverages = departments.map((department) => {
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
                  departmentAverages.reduce((sum, department) => sum + department.averageRating, 0) /
                  departmentAverages.length
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

        resolve({
          totalDepartments,
          totalRatings,
          highestRating,
          lowestRating,
          overallAverageRating,
          departmentAverages,
        });
      } catch (error) {
        console.error('An error occurred fetching department statistics:', error);
        reject(new Error('An error occurred fetching department statistics'));
      }
    });
  });
}





//***********/ UPDATES BEGINNING//***************** */

interface CreateRatingParams{
  departmentId: number,
  stars: number,
  likes: string,
  dislikes: string,
  improvements: string
  userId: number,
  path: string
}

async function calculateAverageRating(departmentId: number, year: number, quarter: number) {
  const ratings = await prisma.rating.findMany({
    where: {
      departmentId,
      year,
      quarter,
      excludeFromAverage : false, // Ensure only ratings are not excluded are considered
    },
    select: {
      stars: true,
    },
  });

  if (ratings.length === 0) return 0;

  const totalStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
  return parseFloat((totalStars / ratings.length).toFixed(2)); // Return average rounded to 2 decimal places
}


// This part is for the regular users to create a rating
// And after creating a rating, I recalculate and update the average score of the department
// export async function createRating({departmentId, stars, likes, dislikes, improvements, userId, path}: CreateRatingParams) {

//   const today = new Date(); // Get the current date

//   try {
//     // Basic validation
//     if (stars < 1 || stars > 5) {
//       throw new Error("Invalid star rating. Please enter a value between 1 and 5.");
//     }

//     // Get current year and calculate quarter
//     const year = today.getFullYear(); // Assign current year
//     const quarter = Math.ceil((today.getMonth() + 1) / 3); // Calculate quarter (1-4)

//     const newRating = await prisma.rating.create({
//       data: {
//         departmentId,
//         stars,
//         likes: likes?.trim() || "", // Trim whitespace from likes
//         dislikes: dislikes?.trim() || "", // Trim whitespace from dislikes
//         improvements: improvements?.trim() || "", // Trim whitespace from improvements
//         quarter,
//         year,
//         ratedByUserId: userId, // Set the user who submitted the rating
//       },
//     });

//     // Calculate new average rating
//     const averageRating = await calculateAverageRating(departmentId, year, quarter);

//     // Upsert department ranking
//     const existingRanking = await prisma.departmentRanking.findFirst({
//       where: {
//         departmentId,
//         year,
//         quarter,
//       },
//     });

//     if (existingRanking) {
//       await prisma.departmentRanking.update({
//         where: {
//           id: existingRanking.id,
//         },
//         data: {
//           averageRating,
//           // Update isPublished or other fields if necessary
//         },
//       });
//     } else {
//       await prisma.departmentRanking.create({
//         data: {
//           departmentId,
//           averageRating,
//           isPublished: false, // or true, based on your logic
//           year,
//           quarter,
//         },
//       });
//     }

//     revalidatePath(path)
//     return newRating; // Return the created rating object
//   } catch (error:any) {
//     console.error(error);
//     throw new Error("An error occurred while creating the rating: " + error.message); // Include original error message
//   } 
// }



export async function createRating({ departmentId, stars, likes, dislikes, improvements, userId, path }: CreateRatingParams): Promise<any> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set session using sessionNamespace
        sessionNamespace.set("session", {
          user: await getSession(), // Assuming getSession() retrieves the current session
        });

        const today = new Date(); // Get the current date

        // Basic validation
        if (stars < 1 || stars > 5) {
          throw new Error("Invalid star rating. Please enter a value between 1 and 5.");
        }

        // Get current year and calculate quarter
        const year = today.getFullYear(); // Assign current year
        const quarter = Math.ceil((today.getMonth() + 1) / 3); // Calculate quarter (1-4)

        // Create a new rating entry
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

        // Calculate the new average rating
        const averageRating = await calculateAverageRating(departmentId, year, quarter);

        // Upsert the department ranking
        const existingRanking = await prisma.departmentRanking.findFirst({
          where: {
            departmentId,
            year,
            quarter,
          },
        });

        if (existingRanking) {
          await prisma.departmentRanking.update({
            where: {
              id: existingRanking.id,
            },
            data: {
              averageRating,
              // Update isPublished or other fields if necessary
            },
          });
        } else {
          await prisma.departmentRanking.create({
            data: {
              departmentId,
              averageRating,
              isPublished: false, // or true, based on your logic
              year,
              quarter,
            },
          });
        }

        // Revalidate path if needed
        revalidatePath(path);

        // Resolve with the created rating
        resolve(newRating);
      } catch (error: any) {
        console.error('Error creating rating:', error);
        reject(new Error("An error occurred while creating the rating: " + error.message));
      }
    });
  });
}



// List of common stopwords to exclude from the word cloud
const stopwords = new Set([
  "the", "and", "for", "with", "that", "this", "to", "a", "in", "of", "on", "at", "it", "is", "as", "was", "but", "by", "an", "or", "if", "from", "be", "are", "they", "their", "them",
  "you", "i", "me", "my", "we", "us", "our", "can", "could", "would", "should", "will", "about", "after", "all", "also", "any", "because", "been", "before", "being", "both", "did",
  "do", "does", "doing", "done", "down", "each", "few", "he", "her", "hers", "him", "his", "how", "just", "like", "more", "most", "no", "not", "now", "only", "other", "out", "over",
  "some", "such", "than", "then", "there", "these", "they're", "through", "up", "what", "when", "where", "which", "who", "why", "will", "your", "yours", "you're", "about", "again",
  "against", "all", "am", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could",
  "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't",
  "having", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how's", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "isn't", "it",
  "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours",
  "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs",
  "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very",
  "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why",
  "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
]);





// Helper function to process text and return word frequency counts
function processText(text: string): { [key: string]: number } {
  const wordCounts: { [key: string]: number } = {};
  text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove punctuation
    .split(/\s+/) // Split into words
    .forEach((word) => {
      if (word && !stopwords.has(word)) {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
  return wordCounts;
}


// To be used in the Department Details Page for Both Admin and User
// It is used to get the (totalRatings, starsCount, averageStars and department details) to put in the Department Details Page
// export async function getDepartmentDetailsForQuarterAndYear(id: number, quarter: number = 0, year: number = 0) {
//   try {
//     const today = new Date();
//     const currentYear = year || today.getFullYear();
//     const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3); // Calculate current quarter if not provided

//     const department = await prisma.department.findUnique({
//       where: { id },
//       include: {
//         ratings: {
//           where: {
//             year: currentYear,
//             quarter: currentQuarter,
//             excludeFromAverage : false, // Ensure only ratings are not excluded are considered
//           },
//           select: {
//             id: true,
//             stars: true,
//             ratedByUserId: true,
//             year:true,
//             quarter:true,
//             ratedByUser: {
//               select: { id: true, departmentId: true, department: { select: { name: true } } }
//             }
//           },
//         },
//       },
//     });

//     if (!department) {
//       return null; // Handle non-existent department
//     }

//     const totalRatings = department.ratings.length;
//     const starsCount = department.ratings.reduce((acc: any, rating: any) => {
//       acc[rating.stars] = (acc[rating.stars] || 0) + 1; // Count occurrences of each star rating
//       return acc;
//     }, {});

//     const averageStars =
//       totalRatings > 0
//         ? parseFloat(
//           (
//             department.ratings.reduce((sum: number, rating: any) => sum + rating.stars, 0) / totalRatings
//           ).toFixed(2)
//         )
//         : 0.0;

//     return {
//       department,
//       totalRatings,
//       starsCount,
//       averageStars
//     };
//   } catch (error) {
//     console.error(error);
//     throw new Error("An error occurred fetching department details"); // Re-throw for client-side handling
//   }
// }

interface Rating {
  id: number;
  stars: number;
  ratedByUserId: number;
  year: number;
  quarter: number;
  ratedByUser: {
    id: number;
    departmentId: number;
    department: {
      name: string;
    };
  };
}

interface DepartmentDetails {
  department: {
    id: number;
    name: string;
    ratings: any;
  };
  totalRatings: number;
  starsCount: Record<number, number>; // Object to store count of each star rating
  averageStars: number;
}

// The function with the defined return type of Promise<DepartmentDetails | null>
export async function getDepartmentDetailsForQuarterAndYear(
  id: number,
  quarter: number = 0,
  year: number = 0
): Promise<DepartmentDetails | null> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set session information
        const session = await getSession();
        sessionNamespace.set("session", { user: session });

        const today = new Date();
        const currentYear = year || today.getFullYear();
        const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3);

        // Fetch department and ratings
        const department = await prisma.department.findUnique({
          where: { id },
          include: {
            ratings: {
              where: {
                year: currentYear,
                quarter: currentQuarter,
                excludeFromAverage: false, // Only include ratings not excluded from average
              },
              select: {
                id: true,
                stars: true,
                ratedByUserId: true,
                year: true,
                quarter: true,
                ratedByUser: {
                  select: { id: true, departmentId: true, department: { select: { name: true } } },
                },
              },
            },
          },
        });

        // Handle non-existent department
        if (!department) {
          resolve(null);
          return;
        }

        const totalRatings = department.ratings.length;

        // Count occurrences of each star rating
        const starsCount = department.ratings.reduce((acc: Record<number, number>, rating: any) => {
          acc[rating.stars] = (acc[rating.stars] || 0) + 1;
          return acc;
        }, {});

        // Calculate the average stars, ensuring no division by zero
        const averageStars =
          totalRatings > 0
            ? parseFloat(
                (
                  department.ratings.reduce((sum: number, rating: any) => sum + rating.stars, 0) / totalRatings
                ).toFixed(2)
              )
            : 0.0;

        resolve({
          department: {
            id: department.id,
            name: department.name,
            ratings: department.ratings,
          },
          totalRatings,
          starsCount,
          averageStars,
        });
      } catch (error) {
        console.error("Error fetching department details:", error);
        reject(new Error("An error occurred fetching department details"));
      }
    });
  });
}

// ************* Departments And My Department Page Server Actions For Both Regular Users & Admin ***************//


interface Rating {
  id: number;
  stars: number;
  ratedByUserId: number;
  likes: string | null;
  dislikes: string | null;
  improvements: string | null;
  year: number;
  quarter: number;
  ratedByUser: {
    id: number;
    departmentId: number;
    department: {
      name: string;
    };
  };
}

interface PaginatedRatings {
  ratings: Rating[];
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalPages: number;
  totalRatingsCount: number;
}

export async function getCommentsPaginationForRegularUsers(
  id: number,
  quarter: number = 0,
  year: number = 0,
  page: number = 1,
  pageSize: number = 10,
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<PaginatedRatings> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set the session inside the namespace
        const session = await getSession();
        sessionNamespace.set("session", { user: session });

        const today = new Date();
        const currentYear = year || today.getFullYear();
        const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3);

        const skip = (page - 1) * pageSize;

        // Get the total number of ratings for pagination
        const totalRatingsCount = await prisma.rating.count({
          where: {
            departmentId: id,
            year: currentYear,
            quarter: currentQuarter,
            isHidden: false,
            excludeFromAverage: false, // Only count non-excluded visible ratings
          },
        });

        // Fetch the paginated ratings
        const ratings = await prisma.rating.findMany({
          where: {
            departmentId: id,
            year: currentYear,
            quarter: currentQuarter,
            isHidden: false,
            excludeFromAverage: false, // Only consider non-excluded ratings
          },
          select: {
            id: true,
            stars: true,
            ratedByUserId: true,
            likes: true,
            dislikes: true,
            improvements: true,
            year: true,
            quarter: true,
            ratedByUser: {
              select: {
                id: true,
                departmentId: true,
                department: {
                  select: { name: true },
                },
              },
            },
          },
          skip: skip,
          take: pageSize,
          orderBy: {
            stars: sortOrder, // Sorting by stars
          },
        });

        // Calculate pagination details
        const totalPages = Math.ceil(totalRatingsCount / pageSize);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        // Resolve the promise with paginated ratings
        resolve({
          ratings,
          currentPage: page,
          hasNextPage,
          hasPreviousPage,
          totalPages,
          totalRatingsCount,
        });
      } catch (error) {
        console.error("Error fetching comments with pagination:", error);
        reject(new Error("An error occurred fetching department details"));
      }
    });
  });
}


export async function getCommentsPaginationForAdmin(
  id: number,
  quarter: number = 0,
  year: number = 0,
  page: number = 1,
  pageSize: number = 10,
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<PaginatedRatings> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set the session inside the namespace
        const session = await getSession();
        sessionNamespace.set("session", { user: session });

        const today = new Date();
        const currentYear = year || today.getFullYear();
        const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3);

        const skip = (page - 1) * pageSize;


        // Get the total number of ratings for pagination
        const totalRatingsCount = await prisma.rating.count({
          where: {
            departmentId: id,
            year: currentYear,
            quarter: currentQuarter,
          },
        });


        // Fetch the paginated ratings
        const ratings = await prisma.rating.findMany({
          where: {
            departmentId: id,
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
            year: true,
            quarter: true,
            isHidden: true,
            excludeFromAverage: true,
            ratedByUser: {
              select: { id: true, departmentId: true, department: { select: { name: true } } }
            }
          },
          skip: skip,
          take: pageSize,
          orderBy: {
            stars: sortOrder // Sorting by stars
          }
        });

        // Calculate pagination details
        const totalPages = Math.ceil(totalRatingsCount / pageSize);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        // Resolve the promise with paginated ratings
        resolve({
          ratings,
          currentPage: page,
          hasNextPage,
          hasPreviousPage,
          totalPages,
          totalRatingsCount,
        });
      } catch (error) {
        console.error("Error fetching comments with pagination:", error);
        reject(new Error("An error occurred fetching department details"));
      }
    });
  });
}


// To get the comments and Pagination for ADMINS, because it just fetches the ALL comments
// export async function getCommentsPaginationForAdmin(
//   id: number,
//   quarter: number = 0,
//   year: number = 0,
//   page: number = 1,
//   pageSize: number = 10,
//   sortOrder: 'asc' | 'desc' = 'desc'
// ) {
//   try {
//     const today = new Date();
//     const currentYear = year || today.getFullYear();
//     const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3); // Calculate current quarter if not provided

//     const skip = (page - 1) * pageSize;

//     // First, get the total number of ratings to calculate pagination details
//     const totalRatingsCount = await prisma.rating.count({
//       where: {
//         departmentId: id,
//         year: currentYear,
//         quarter: currentQuarter,
//       },
//     });

//     // Fetch the paginated ratings
//     const ratings = await prisma.rating.findMany({
//       where: {
//         departmentId: id,
//         year: currentYear,
//         quarter: currentQuarter,
//       },
//       select: {
//         id: true,
//         stars: true,
//         ratedByUserId: true,
//         likes: true,
//         dislikes: true,
//         improvements: true,
//         year: true,
//         quarter: true,
//         isHidden: true,
//         excludeFromAverage: true,
//         ratedByUser: {
//           select: { id: true, departmentId: true, department: { select: { name: true } } }
//         }
//       },
//       skip: skip,
//       take: pageSize,
//       orderBy: {
//         stars: sortOrder // Sorting by stars
//       }
//     });

//     // Calculate pagination details
//     const totalPages = Math.ceil(totalRatingsCount / pageSize);
//     const hasNextPage = page < totalPages;
//     const hasPreviousPage = page > 1;

//     return {
//       ratings,         // The actual rating comments for this page
//       currentPage: page,
//       hasNextPage,
//       hasPreviousPage,
//       totalPages,
//       totalRatingsCount
//     };
//   } catch (error) {
//     console.error(error);
//     throw new Error("An error occurred fetching department details");
//   }
// }







// ************* Departments And My Department Page Server Actions For Both Regular Users & Admin Ending ***************//








// For Regular Users in that department to download
export async function getDepartmentRatingsForQuarter(
  departmentId: number,
  quarter: number,
  year: number
) {
  try {
    // Fetch all ratings for the given department, quarter, and year
    const ratings = await prisma.rating.findMany({
      where: {
        departmentId: departmentId,
        quarter: quarter,
        year: year,
        isHidden: false, // Only include non-hidden ratings,
        excludeFromAverage : false, // Ensure only ratings are not excluded are considered
      },
      select: {
        stars: true,
        likes: true,
        dislikes: true,
        improvements: true,
        quarter: true,
        year: true,
        ratedByUser: {
          select: {
            department: {
              select: {
                name: true,
              },
            },
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    // Map the ratings to the desired format
    const ratingCsvJSON = ratings.map((rating: any) => ({
      stars: rating.stars || 0,
      likes: rating.likes || '',
      dislikes: rating.dislikes || '',
      improvements: rating.improvements || '',
      'Department Rated': rating.department.name || '',
      quarter: rating.quarter || 0,
      year: rating.year || 0,
      "Rater's Department": rating.ratedByUser?.department?.name || 'Anonymous',
    }));

    return ratingCsvJSON;
  } catch (error) {
    console.error("Error fetching department ratings:", error);
    throw new Error("An error occurred while fetching department ratings.");
  }
}

// For Regular Users in that department
export async function getDepartmentRatingsForYear(
  departmentId: number,
  year: number
) {
  try {
    // Fetch all ratings for the given department and year
    const ratings = await prisma.rating.findMany({
      where: {
        departmentId: departmentId,
        year: year,
        isHidden: false, // Only include non-hidden ratings
        excludeFromAverage : false, // Ensure only ratings are not excluded are considered
      },
      select: {
        stars: true,
        likes: true,
        dislikes: true,
        improvements: true,
        quarter: true,
        year: true,
        ratedByUser: {
          select: {
            department: {
              select: {
                name: true,
              },
            },
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    // Map the ratings to the desired format
    const ratingCsvJSON = ratings.map((rating: any) => ({
      stars: rating.stars || 0,
      likes: rating.likes || '',
      dislikes: rating.dislikes || '',
      improvements: rating.improvements || '',
      'Department Rated': rating.department.name || '',
      quarter: rating.quarter || 0,
      year: rating.year || 0,
      "Rater's Department": rating.ratedByUser?.department?.name || 'Anonymous',
    }));

    return ratingCsvJSON;
  } catch (error) {
    console.error("Error fetching department ratings:", error);
    throw new Error("An error occurred while fetching department ratings.");
  }
}


// To generate WordCloud for both Admin and Regular User
export async function generateWordCloudDataForFields(
  departmentId: number,
  year: number,
  quarter: number
) {
  try {
    // Fetch the relevant data from the database
    const ratings = await prisma.rating.findMany({
      where: {
        departmentId: departmentId,
        year: year,
        quarter: quarter,
        isHidden: false, // Only include non-hidden ratings,
        excludeFromAverage : false, // Ensure only ratings are not excluded are considered
      },
      select: {
        likes: true,
        dislikes: true,
        improvements: true,
      },
    });


    // Separate text processing for likes, dislikes, and improvements
    const likesText = ratings.map((rating) => rating.likes).join(" ");
    const dislikesText = ratings.map((rating) => rating.dislikes).join(" ");
    const improvementsText = ratings.map((rating) => rating.improvements).join(" ");

    const likesWordCounts = processText(likesText);
    const dislikesWordCounts = processText(dislikesText);
    const improvementsWordCounts = processText(improvementsText);

    // Convert word counts to word cloud data format
    const likesWordCloudData = Object.entries(likesWordCounts).map(([text, value]) => ({
      text,
      value,
    }));

    const dislikesWordCloudData = Object.entries(dislikesWordCounts).map(([text, value]) => ({
      text,
      value,
    }));

    const improvementsWordCloudData = Object.entries(improvementsWordCounts).map(([text, value]) => ({
      text,
      value,
    }));

    return {
      likesWordCloudData,
      dislikesWordCloudData,
      improvementsWordCloudData,
    };
  } catch (error) {
    console.error("Error generating word cloud data:", error);
    throw new Error("An error occurred while generating word cloud data.");
  }
}




export async function getRatingProperties(ratingId: number) {
  try {
    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
      select: {
        isHidden: true,
        excludeFromAverage: true,
      },
    });

    if (!rating) {
      throw new Error('Rating not found');
    }

    return rating;
  } catch (error) {
    console.error('Error fetching rating properties:', error);
    throw new Error('An error occurred while fetching rating properties');
  }
}




// ************* Ranking Page Server Actions For Both Regular Users & Admin  ***************//

// To get the  Deparment Ranking for the Ranking Page of the Regular Users
// export async function getDepartmentRankingData(quarter = 0, year = 0) {
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

//     // Map to the desired structure
//     const formattedRankings = departmentRankings.map(ranking => ({
//       id: ranking.id,
//       name: ranking.department.name,
//       averageRating: ranking.averageRating,
//     }));

//     return formattedRankings;
//   } catch (error) {
//     console.error(error);
//     throw new Error('An error occurred fetching department ranking data');
//   }
// }

interface DepartmentRanking {
  id: number;
  name: string;
  averageRating: number;
}

export async function getDepartmentRankingData(quarter = 0, year = 0): Promise<DepartmentRanking[]> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set session data in the namespace
        sessionNamespace.set("session", {
          user: await getSession(), // Assuming getSession returns the session object
        });

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

        // Map to the desired structure
        const formattedRankings = departmentRankings.map(ranking => ({
          id: ranking.id,
          name: ranking.department.name,
          averageRating: ranking.averageRating,
        }));

        resolve(formattedRankings);
      } catch (error) {
        console.error('An error occurred fetching department ranking data:', error);
        reject(new Error('An error occurred fetching department ranking data'));
      }
    });
  });
}

// To get the Department Ranking for the Admin Page
// export async function getDepartmentRankingDataForAdmin(quarter = 0, year = 0) {
//   try {
//     const today = new Date();
//     const currentYear = year || today.getFullYear();
//     const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3);

//     // Fetch department rankings for the specified or current year and quarter regardless of isPublished status
//     const departmentRankings = await prisma.departmentRanking.findMany({
//       where: {
//         year: currentYear,
//         quarter: currentQuarter,
//       },
//       include: {
//         department: true,
//       },
//       orderBy: {
//         averageRating: 'desc',
//       },
//     });

//     // Map to the desired structure
//     const formattedRankings = departmentRankings.map(ranking => ({
//       id: ranking.id,
//       name: ranking.department.name,
//       averageRating: ranking.averageRating,
//       isPublished: ranking.isPublished, // include isPublished in the response if needed
//     }));

//     return formattedRankings;
//   } catch (error) {
//     console.error(error);
//     throw new Error('An error occurred fetching department ranking data for admin');
//   }
// }

export async function getDepartmentRankingDataForAdmin(
  quarter = 0,
  year = 0
): Promise<
  { id: number; name: string; averageRating: number; isPublished: boolean }[]
> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set the session using sessionNamespace
        sessionNamespace.set("session", {
          user: await getSession(), // Assuming getSession() retrieves the session for the current user
        });

        const today = new Date();
        const currentYear = year || today.getFullYear();
        const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3);

        // Fetch department rankings for the specified or current year and quarter regardless of isPublished status
        const departmentRankings = await prisma.departmentRanking.findMany({
          where: {
            year: currentYear,
            quarter: currentQuarter,
          },
          include: {
            department: true,
          },
          orderBy: {
            averageRating: 'desc',
          },
        });

        // Map to the desired structure
        const formattedRankings = departmentRankings.map((ranking) => ({
          id: ranking.id,
          name: ranking.department.name,
          averageRating: ranking.averageRating,
          isPublished: ranking.isPublished, // include isPublished in the response if needed
        }));

        resolve(formattedRankings);
      } catch (error) {
        console.error(
          'An error occurred fetching department ranking data for admin:',
          error
        );
        reject(
          new Error('An error occurred fetching department ranking data for admin')
        );
      }
    });
  });
}


// export async function toggleIsHidden(ratingId: number) {
//   try {
//     // Fetch the current value of isHidden
//     const rating = await prisma.rating.findUnique({
//       where: { id: ratingId },
//     });

//     if (!rating) {
//       throw new Error('Rating not found');
//     }

//     // Toggle the isHidden property
//     const updatedRating = await prisma.rating.update({
//       where: { id: ratingId },
//       data: { isHidden: !rating.isHidden },
//     });

//     return updatedRating;
//   } catch (error) {
//     console.error('Error toggling isHidden:', error);
//     throw new Error('An error occurred while toggling isHidden');
//   }
// }

export async function toggleIsHidden(ratingId: number): Promise<any> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set session using sessionNamespace
        sessionNamespace.set("session", {
          user: await getSession(), // Assuming getSession() retrieves the current session
        });

        // Fetch the current value of isHidden
        const rating = await prisma.rating.findUnique({
          where: { id: ratingId },
        });

        if (!rating) {
          throw new Error('Rating not found');
        }

        // Toggle the isHidden property
        const updatedRating = await prisma.rating.update({
          where: { id: ratingId },
          data: { isHidden: !rating.isHidden },
        });

        // Resolve with the updated rating
        resolve(updatedRating);
      } catch (error: any) {
        console.error('Error toggling isHidden:', error.message);
        reject(new Error('An error occurred while toggling isHidden: ' + error.message));
      }
    });
  });
}



// export async function toggleExcludeFromAverage(ratingId: number) {
//   try {
//     // Fetch the current value of excludeFromAverage
//     const rating = await prisma.rating.findUnique({
//       where: { id: ratingId },
//     });

//     if (!rating) {
//       throw new Error('Rating not found');
//     }

//     // Toggle the excludeFromAverage property
//     const updatedRating = await prisma.rating.update({
//       where: { id: ratingId },
//       data: { excludeFromAverage: !rating.excludeFromAverage },
//     });

//     return updatedRating;
//   } catch (error) {
//     console.error('Error toggling excludeFromAverage:', error);
//     throw new Error('An error occurred while toggling excludeFromAverage');
//   }
// }

export async function toggleExcludeFromAverage(ratingId: number): Promise<any> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set session using sessionNamespace
        sessionNamespace.set("session", {
          user: await getSession(), // Assuming getSession() retrieves the current session
        });

        // Fetch the current value of excludeFromAverage
        const rating = await prisma.rating.findUnique({
          where: { id: ratingId },
        });

        if (!rating) {
          throw new Error('Rating not found');
        }

        // Toggle the excludeFromAverage property
        const updatedRating = await prisma.rating.update({
          where: { id: ratingId },
          data: { excludeFromAverage: !rating.excludeFromAverage },
        });

        // Resolve with the updated rating
        resolve(updatedRating);
      } catch (error: any) {
        console.error('Error toggling excludeFromAverage:', error.message);
        reject(new Error('An error occurred while toggling excludeFromAverage: ' + error.message));
      }
    });
  });
}




// ************* Ranking Page Server Actions For Both Regular Users & Admin Ending ***************//

interface DepartmentAndCorporateScores {
  corporateScore: number;
  departmentScore: number;
  departmentName: string;
}



export async function getDepartmentAndCorporateScores(year = 0, quarter = 0, departmentId: number | null = null): Promise<DepartmentAndCorporateScores> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        
        sessionNamespace.set("session", {
          user: await getSession(),
        });
        const today = new Date();
        const currentYear = year || today.getFullYear();
        const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3);

        // Fetch all published department rankings for the specified year and quarter
        const departmentRankings = await prisma.departmentRanking.findMany({
          where: {
            year: currentYear,
            quarter: currentQuarter,
            isPublished: true,
          },
          select: {
            departmentId: true,
            averageRating: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        });

        if (departmentRankings.length === 0) {
          resolve({
            corporateScore: 0,
            departmentScore: 0,
            departmentName: "",
          });
          return;
        }

        // Calculate the corporate score
        const totalAverageRating = departmentRankings.reduce((sum, ranking) => sum + ranking.averageRating, 0);
        const corporateScore = parseFloat((totalAverageRating / departmentRankings.length).toFixed(2));

        // Get the specific department's score, if departmentId is provided
        let departmentScore = 0;
        let departmentName = "";
        if (departmentId) {
          const departmentRanking = departmentRankings.find(ranking => ranking.departmentId === departmentId);
          if (departmentRanking) {
            departmentScore = departmentRanking.averageRating;
            departmentName = departmentRanking.department.name;
          }
        }

        resolve({
          corporateScore,
          departmentScore,
          departmentName,
        });
      } catch (error) {
        console.error('An error occurred fetching department and corporate scores:', error);
        reject(new Error('An error occurred fetching department and corporate scores'));
      }
    });
  });
}



interface QuarterlyAverage {
  quarter: string;
  year: number;
  value: number;
}

export async function getDepartmentQuarterlyAverages(departmentId: number): Promise<QuarterlyAverage[]> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Retrieve session from the context
        sessionNamespace.set("session", {
          user: await getSession(),
        });

        // Fetch the department rankings for the specified department
        const departmentRankings = await prisma.departmentRanking.findMany({
          where: {
            departmentId: departmentId,
            isPublished: true,
          },
          select: {
            quarter: true,
            year: true,
            averageRating: true,
          },
          orderBy: [
            { year: 'asc' },
            { quarter: 'asc' },
          ],
        });

        // Map the results to the desired structure
        const data: QuarterlyAverage[] = departmentRankings.map(ranking => ({
          quarter: `Q${ranking.quarter}`,
          year: ranking.year,
          value: ranking.averageRating,
        }));

        resolve(data);
      } catch (error) {
        console.error('An error occurred fetching the department quarterly averages:', error);
        reject(new Error('An error occurred fetching the department quarterly averages'));
      }
    });
  });

}

// DON'T USE SESSION HERE
export async function getDepartmentQuarterlyAveragesForRouteHandler(departmentId: number): Promise<QuarterlyAverage[]> {
  try {
    // Fetch the department rankings for the specified department
    const departmentRankings = await prisma.departmentRanking.findMany({
      where: {
        departmentId: departmentId,
        isPublished: true,
      },
      select: {
        quarter: true,
        year: true,
        averageRating: true,
      },
      orderBy: [
        { year: 'asc' },
        { quarter: 'asc' },
      ],
    });

    // Map the results to the desired structure
    const data: QuarterlyAverage[] = departmentRankings.map(ranking => ({
      quarter: `Q${ranking.quarter}`,
      year: ranking.year,
      value: ranking.averageRating,
    }));

    return data;
  } catch (error) {
    console.error('An error occurred fetching the department quarterly averages:', error);
    throw new Error('An error occurred fetching the department quarterly averages');
  }
}

interface QuarterlyCorporateScore {
  quarter: string;
  year: number;
  value: number;
}


export async function getCorporateScoreTrends(): Promise<QuarterlyCorporateScore[]> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Retrieve session from the context
        sessionNamespace.set("session", {
          user: await getSession(), // Get the current session user
        });

        // Fetch distinct year and quarter combinations for which department rankings are available
        const periods = await prisma.departmentRanking.findMany({
          where: {
            isPublished: true,
          },
          select: {
            year: true,
            quarter: true,
          },
          distinct: ['year', 'quarter'],
          orderBy: [
            { year: 'asc' },
            { quarter: 'asc' },
          ],
        });

        // Iterate over each period and calculate the corporate score
        const corporateScores: QuarterlyCorporateScore[] = [];
        for (const period of periods) {
          const { year, quarter } = period;

          // Fetch all published department rankings for the specified year and quarter
          const departmentRankings = await prisma.departmentRanking.findMany({
            where: {
              year,
              quarter,
              isPublished: true,
            },
            select: {
              departmentId: true,
              averageRating: true,
              department: {
                select: {
                  name: true,
                },
              },
            },
          });

          // If no department rankings exist, skip this period
          if (departmentRankings.length === 0) continue;

          // Calculate the corporate score
          const totalAverageRating = departmentRankings.reduce((sum, ranking) => sum + ranking.averageRating, 0);
          const corporateScore = parseFloat((totalAverageRating / departmentRankings.length).toFixed(2));

          // Add the result to the corporateScores array
          corporateScores.push({
            quarter: `Q${quarter}`,
            year,
            value: corporateScore,
          });
        }

        resolve(corporateScores);
      } catch (error) {
        console.error('An error occurred fetching the corporate score trends:', error);
        reject(new Error('An error occurred fetching the corporate score trends'));
      }
    });
  });
}


type DepartmentData = {
  department: string;
  quarter: string;
  year: number;
  value: number;
};


export async function getDepartmentRankingDataForGraph(): Promise<DepartmentData[]> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Retrieve session and set it in sessionNamespace
        const session = await getSession();
        sessionNamespace.set("session", {
          user: session // Get the current session user ID
        });

        // Fetch all published department rankings
        const departmentRankings = await prisma.departmentRanking.findMany({
          where: {
            isPublished: true,
          },
          select: {
            department: {
              select: {
                name: true,
              },
            },
            quarter: true,
            year: true,
            averageRating: true,
          },
          orderBy: [
            { year: 'asc' },
            { quarter: 'asc' },
          ],
        });

        // If no data is found
        if (departmentRankings.length === 0) {
          resolve([]);
          return;
        }

        // Map the department rankings into the desired structure
        const departmentData = departmentRankings.map((ranking) => ({
          department: ranking.department.name,
          quarter: `Q${ranking.quarter}`,
          year: ranking.year,
          value: ranking.averageRating,
        }));

        // Resolve with the mapped department data
        resolve(departmentData);
      } catch (error) {
        console.error('Error fetching department ranking data:', error);
        reject(new Error('Failed to fetch department ranking data'));
      }
    });
  });
}


// DON'T USE SESSIONS HERE
export async function getDepartmentQuarterlyAveragesUpToQuarter(departmentId: any, targetYear: number, targetQuarter: number) {
  try {
    // Fetch the department rankings for the specified department
    const departmentRankings = await prisma.departmentRanking.findMany({
      where: {
        departmentId: departmentId,
        isPublished: true,
        OR: [
          { year: targetYear, quarter: { lte: targetQuarter } },
          { year: { lt: targetYear } }
        ],
      },
      select: {
        quarter: true,
        year: true,
        averageRating: true,
      },
      orderBy: [
        { year: 'asc' },
        { quarter: 'asc' },
      ],
    });

    // Map the results to the desired structure
    const data = departmentRankings.map(ranking => ({
      quarter: `Q${ranking.quarter}`,
      year: ranking.year,
      value: ranking.averageRating,
    }));

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred fetching the department quarterly averages');
  }
}


export async function getDownloadableRatingsDataForQuarterAndYear(quarter: number, year: number) {
  try {
    // Fetch ratings for the specified quarter and year
    const ratings = await prisma.rating.findMany({
      where: {
        quarter,
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

    // Map the ratings to the desired format
    const ratingCsvJSON = ratings.map((rating:any) => ({
      stars: rating.stars || 0,
      likes: rating.likes || '',
      dislikes: rating.dislikes || '',
      improvements: rating.improvements || '',
      'Department Rated': rating.department ? rating.department.name : 'N/A',
      quarter: rating.quarter || 0,
      year: rating.year || 0,
      Rater: rating.ratedByUser ? rating.ratedByUser.name : 'N/A',
      "Rater's Department": rating.ratedByUser && rating.ratedByUser.department ? rating.ratedByUser.department.name : 'N/A',
      "Excluded From Average Calculation": rating.excludeFromAverage || false,
      "Hidden": rating.isHidden || false,
    }));

    return ratingCsvJSON;
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw new Error('An error occurred while fetching ratings.');
  }
}
export async function getDownloadableRatingsDataForYear(year: number) {
  try {
    // Fetch ratings for the specified quarter and year
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

    // Map the ratings to the desired format
    const ratingCsvJSON = ratings.map((rating:any) => ({
      stars: rating.stars || 0,
      likes: rating.likes || '',
      dislikes: rating.dislikes || '',
      improvements: rating.improvements || '',
      'Department Rated': rating.department ? rating.department.name : 'N/A',
      quarter: rating.quarter || 0,
      year: rating.year || 0,
      Rater: rating.ratedByUser ? rating.ratedByUser.name : 'N/A',
      "Rater's Department": rating.ratedByUser && rating.ratedByUser.department ? rating.ratedByUser.department.name : 'N/A',
      "Excluded From Average Calculation": rating.excludeFromAverage || false,
      "Hidden": rating.isHidden || false,
    }));

    return ratingCsvJSON;
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw new Error('An error occurred while fetching ratings.');
  }
}


export async function getQuarterlyDepartmentRatingsForAdmin(departmentId: number, quarter: number, year: number) {
  try {
    // Fetch all ratings for the given department, quarter, and year without filtering hidden or excluded ratings
    const ratings = await prisma.rating.findMany({
      where: {
        departmentId: departmentId,
        quarter: quarter,
        year: year,
      },
      select: {
        stars: true,
        likes: true,
        dislikes: true,
        improvements: true,
        quarter: true,
        year: true,
        isHidden: true,
        excludeFromAverage: true,
        ratedByUser: {
          select: {
            name: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    // Map the ratings to the desired format
    const ratingCsvJSON = ratings.map((rating: any) => ({
      stars: rating.stars || 0,
      likes: rating.likes || '',
      dislikes: rating.dislikes || '',
      improvements: rating.improvements || '',
      'Department Rated': rating.department ? rating.department.name : 'N/A',
      quarter: rating.quarter || 0,
      year: rating.year || 0,
      Rater: rating.ratedByUser ? rating.ratedByUser.name : 'N/A',
      "Rater's Department": rating.ratedByUser && rating.ratedByUser.department ? rating.ratedByUser.department.name : 'N/A',
      "Excluded From Average Calculation": rating.excludeFromAverage || false,
      "Hidden": rating.isHidden || false,
    }));

    return ratingCsvJSON;
  } catch (error) {
    console.error("Error fetching department ratings:", error);
    throw new Error("An error occurred while fetching department ratings.");
  }
}

export async function getYearlyDepartmentRatingsForAdmin(departmentId: number, year: number) {
  try {
    // Fetch all ratings for the given department and year without filtering hidden or excluded ratings
    const ratings = await prisma.rating.findMany({
      where: {
        departmentId: departmentId,
        year: year,
      },
      select: {
        stars: true,
        likes: true,
        dislikes: true,
        improvements: true,
        quarter: true,
        year: true,
        isHidden: true,
        excludeFromAverage: true,
        ratedByUser: {
          select: {
            name: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
        department: {
          select: {
            name: true,
          },
        },
      },
    });

    // Map the ratings to the desired format
    const ratingCsvJSON = ratings.map((rating: any) => ({
      stars: rating.stars || 0,
      likes: rating.likes || '',
      dislikes: rating.dislikes || '',
      improvements: rating.improvements || '',
      'Department Rated': rating.department ? rating.department.name : 'N/A',
      quarter: rating.quarter || 0,
      year: rating.year || 0,
      Rater: rating.ratedByUser ? rating.ratedByUser.name : 'N/A',
      "Rater's Department": rating.ratedByUser && rating.ratedByUser.department ? rating.ratedByUser.department.name : 'N/A',
      "Excluded From Average Calculation": rating.excludeFromAverage || false,
      "Hidden": rating.isHidden || false,
    }));

    return ratingCsvJSON;
  } catch (error) {
    console.error("Error fetching department ratings:", error);
    throw new Error("An error occurred while fetching department ratings.");
  }
}

// export async function getAllDepartmentsWithAverageScore() {
//   try {
//     const today = new Date();
//     const currentYear = today.getFullYear();
//     const currentQuarter = Math.ceil((today.getMonth() + 1) / 3);

//     const departments = await prisma.department.findMany({
//       select: {
//         id: true,
//         name: true,
//         departmentRanking: {
//           where: {
//             year: currentYear,
//             quarter: currentQuarter,
//           },
//           select: {
//             averageRating: true,
//           },
//         },
//       },
//     });

//     const departmentsWithAverageScore = departments.map(department => ({
//       id: department.id,
//       name: department.name,
//       averageScore: department.departmentRanking[0]?.averageRating || 0,
//       quarter: currentQuarter,
//       year: currentYear,
//     }));

//     return departmentsWithAverageScore;
//   } catch (error) {
//     console.error('Error fetching departments:', error);
//     throw new Error('An error occurred while fetching departments.');
//   }
// }

interface DepartmentWithAverageScore {
  id: number;
  name: string;
  averageScore: number;
  quarter: number;
  year: number;
}

export async function getAllDepartmentsWithAverageScore(): Promise<DepartmentWithAverageScore[]> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set the session inside the namespace
        const session = await getSession();
        sessionNamespace.set("session", { user: session });

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentQuarter = Math.ceil((today.getMonth() + 1) / 3);

        // Fetch departments and their rankings
        const departments = await prisma.department.findMany({
          select: {
            id: true,
            name: true,
            departmentRanking: {
              where: {
                year: currentYear,
                quarter: currentQuarter,
              },
              select: {
                averageRating: true,
              },
            },
          },
        });

        // Map the departments and their average scores
        const departmentsWithAverageScore = departments.map(department => ({
          id: department.id,
          name: department.name,
          averageScore: department.departmentRanking[0]?.averageRating || 0,
          quarter: currentQuarter,
          year: currentYear,
        }));

        // Resolve the promise with the result
        resolve(departmentsWithAverageScore);
      } catch (error) {
        console.error('Error fetching departments:', error);
        reject(new Error('An error occurred while fetching departments.'));
      }
    });
  });
}



// DON'T USE SESSION HERE
// Server Action to generate and save the performance trend chart
export async function generateAndSavePerformanceTrendChart(
  departmentId: number,
  year: number,
  departmentAverages: { quarter: string; year: number; value: number }[]
) {
  try {
    // Create the chart configuration for QuickChart
    const chartConfig = {
      type: 'line',
      data: {
        labels: departmentAverages.map((data) => `${data.year} ${data.quarter}`),
        datasets: [
          {
            label: 'Average Rating',
            data: departmentAverages.map((data) => data.value),
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

     const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));
     const chartUrl = `https://quickchart.io/chart?c=${encodedConfig}`;
 
     // Call QuickChart API to generate the chart
     const response = await axios.get(chartUrl, {
       responseType: 'arraybuffer', // Expecting an image buffer
     });
 

    // Generate the file path
    const imageBuffer = response.data;
    const latestData = departmentAverages[departmentAverages.length - 1];
    const latestQuarter = latestData.quarter;
    const latestYear = latestData.year;

    // Updated filename to include the latest quarter and year
    const filename = `department_performancetrends_${departmentId}_${latestYear}_${latestQuarter}.png`;
    const dirPath = path.join(process.cwd(), 'public/images/reports/performancetrends');
    const filePath = path.join(dirPath, filename);

    // Ensure the directory exists
    await fs.mkdir(dirPath, { recursive: true });

    // Save the image buffer to the file
    await fs.writeFile(filePath, imageBuffer);

    // Return the relative path to the saved image
    return `/images/reports/performancetrends/${filename}`;
  } catch (error) {
    console.error('Error generating and saving performance trend chart:', error);
    throw new Error('Failed to generate and save performance trend chart.');
  }
}


// DON'T USE SESSION HERE
export async function getDepartmentStarCount(
  id: number,
  quarter: number = 0,
  year: number = 0
) {
  try {
    const today = new Date();
    const currentYear = year || today.getFullYear();
    const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3);

    // Fetch the department and its ratings for the specified quarter and year
    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        ratings: {
          where: {
            year: currentYear,
            quarter: currentQuarter,
          },
          select: { stars: true }, // Only select the star ratings
        },
      },
    });

    // Handle the case where the department doesn't exist
    if (!department) {
      return {
        error: 'Department not found',
        starCount: null,
      };
    }

    // Count the occurrences of each star rating
    const starCount = department.ratings.reduce((acc: Record<number, number>, rating: { stars: number }) => {
      acc[rating.stars] = (acc[rating.stars] || 0) + 1;
      return acc;
    }, {});

    // Calculate the total number of ratings
      const totalRatings = Object.values(starCount).reduce((sum, count) => sum + count, 0);

      // Calculate the percentage for each star rating
      const starPercentages = Object.keys(starCount).reduce((acc: Record<number, number>, stars) => {
        const star = Number(stars);
        const percentage = (starCount[star] / totalRatings) * 100;
        acc[star] = Math.round(percentage * 100) / 100; // Round to 2 decimal places
        return acc;
      }, {});


    // Return the star count object
    return {
      starCount:starPercentages,
    };
  } catch (error: any) {
    console.error('Error fetching department star count:', error);
    return {
      error: 'Failed to fetch star count',
      starCount: null,
    };
  }
}

// Don't use session here
export async function generateAndSaveSatisfactionLevelChart(
  departmentId: number,
  quarter: number,
  year: number,
  starCount: Record<string, number> | null // Allow null to be passed
) {
  try {
    // Handle null starCount
    if (!starCount) {
      throw new Error('Star count data is required');
    }
   
    // Ensure all star ratings from 1 to 5 are represented
    const completeStarCount: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, ...starCount };



        // Create labels with descriptive terms
        const labels: Record<string, string> = {
          '1': 'Poor',
          '2': 'Below Average',
          '3': 'Average',
          '4': 'Exceeds',
          '5': 'Exceptional'
        };

        // Sort star ratings from highest to lowest
    const sortedStarKeys = Object.keys(completeStarCount).sort((a, b) => Number(b) - Number(a));

    // Map sorted keys to labels and prepare data
    const sortedLabels = sortedStarKeys.map(key => labels[key]);
    const data = sortedStarKeys.map(key => completeStarCount[key]);


    // Create the chart configuration for QuickChart
    const chartConfig = {
      type: 'horizontalBar', // Set the type to 'horizontalBar'
      data: {
        labels:sortedLabels, // Star ratings as labels
        datasets: [
          {
            label: 'Satisfaction Levels(%)',
            data, // Corresponding percentage for each star rating
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
            max: 100, // Maximum value is 100% on the x-axis
          },
        },
      },
    };

    // Encode the chart configuration as a JSON string
    const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig));

    // Construct the QuickChart URL
    const chartUrl = `https://quickchart.io/chart?c=${encodedConfig}`;

    // // Fetch the chart image from QuickChart
    const response = await axios.get(chartUrl, {
      responseType: 'arraybuffer', // Expecting an image buffer
    });

    // // Generate the file path
    const imageBuffer = response.data;
    const filename = `department_satisfactionLevel_${departmentId}_${quarter}_${year}.png`;
    const dirPath = path.join(process.cwd(), 'public/images/reports/satisfactionLevels');
    const filePath = path.join(dirPath, filename);

    // Ensure the directory exists
    await fs.mkdir(dirPath, { recursive: true });

    // Save the image buffer to the file
    await fs.writeFile(filePath, imageBuffer);

    // // Return the relative path to the saved image
    return `/images/reports/satisfactionLevels/${filename}`;
  } catch (error) {
    console.error('Error generating and saving satisfaction level chart:', error);
    throw new Error('Failed to generate and save satisfaction level chart.');
  }
}



// DON'T USE SESSION HERE
export async function getRatingsForDepartmentalReport(departmentId: number, quarter: number, year: number) {
  try {
    // Fetch the ratings for the department, filtered by quarter, year, and the specified conditions
    const ratings = await prisma.rating.findMany({
      where: {
        departmentId,
        quarter,
        year,
        isHidden: false,
        excludeFromAverage: false,
      },
      select: {
        likes: true,
        dislikes: true,
        improvements: true,
        department: {
          select: {
            name: true,
          },},
      },
    });

     // Extract department name (assumes all ratings are for the same department)
     const departmentName = ratings.length > 0 ? ratings[0].department.name : null;

    // Separate the likes, dislikes, and improvements into their respective arrays
    const likes = ratings.map(rating => rating.likes);
    const dislikes = ratings.map(rating => rating.dislikes);
    const improvements = ratings.map(rating => rating.improvements);

    // Return the data in the required format
    return {
      likes,
      dislikes,
      improvements,
      departmentName
    };
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw new Error('Failed to retrieve ratings');
  }
}

export async function getAllDepartments(page: number = 1, limit: number = 10) {
  // Count the total number of departments
  const totalDepartments = await prisma.department.count();

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalDepartments / limit);

  // Determine if there are previous and next pages
  const PrevPageExists = page > 1;
  const NextPageExists = page < totalPages;

  // Fetch departments with pagination
  const departments = await prisma.department.findMany({
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
    },
  });

  return {
    departments,
    totalPages,
    currentPage: page,
    NextPageExists,
    PrevPageExists,
  };
}


interface CorporateReport {
  quarter: string;
  year: string;
  file: File;
  isPublished: boolean;
  pathName: string
}


// export async function handleReportUploadAction(formData: FormData) {

//   const quarter = formData.get('quarter') as string;
//   const year = formData.get('year') as string;
//   const isPublished = formData.get('isPublished') === 'true';
//   const file = formData.get('file') as File ;
//   const pathName = formData.get('pathName') as string

//   if (!file || file.size === 0) {
//     throw new Error('No file uploaded');
//   }
  

//   try {
//     // Define the directory where the file will be saved
//     const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'reports');
    
//     // Ensure the directory exists
//     await fs.mkdir(uploadDir, { recursive: true });

//     // Create a unique file name with a timestamp to avoid collisions
//      // Get the current date and time in a readable format

//      // Create a unique file name with the timestamp and original file name
//      const fileName = `${file.name}`;
//     const filePath = path.join(uploadDir, fileName);

//     // Read the file as a Buffer
//      // Read the file as a Buffer
//      const arrayBuffer = await file.arrayBuffer();
//      const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
//     // Write the file to the server

//     await fs.writeFile(filePath, buffer as any);

//     // // Save the report details in the database
//     const report = await prisma.corporateReport.create({
//       data: {
//         quarter,
//         year,
//         fileUrl: `/uploads/reports/${fileName}`, // Save the file path
//         isPublished,
//       },
//     });

//     revalidatePath(pathName)
//     return {
//       success: true,
//       report,
//     };
//   } catch (error:any) {
//     console.log("Error uploading report:", error.message);
//     throw new Error("An error occurred while uploading the report", error);
//   }
// }


export async function handleReportUploadAction(formData: FormData): Promise<{ success: boolean; report: any }> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set session using sessionNamespace
        sessionNamespace.set("session", {
          user: await getSession(), // Assuming getSession() retrieves the current session
        });

        const quarter = formData.get('quarter') as string;
        const year = formData.get('year') as string;
        const isPublished = formData.get('isPublished') === 'true';
        const file = formData.get('file') as File;
        const pathName = formData.get('pathName') as string;

        if (!file || file.size === 0) {
          throw new Error('No file uploaded');
        }

        // Define the directory where the file will be saved
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'reports');

        // Ensure the directory exists
        await fs.mkdir(uploadDir, { recursive: true });

        // Create a unique file name with the original file name
        const fileName = `${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        // Read the file as a Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer

        // Write the file to the server
        await fs.writeFile(filePath, buffer as any);

        // Save the report details in the database
        const report = await prisma.corporateReport.create({
          data: {
            quarter,
            year,
            fileUrl: `/uploads/reports/${fileName}`, // Save the file path
            isPublished,
          },
        });

        // Revalidate the path
        revalidatePath(pathName);

        // Resolve the result
        resolve({
          success: true,
          report,
        });
      } catch (error: any) {
        console.error('Error uploading report:', error.message);
        reject(new Error('An error occurred while uploading the report: ' + error.message));
      }
    });
  });
}



// export async function getPaginatedCorporateReports(page: number = 1, limit: number = 10) {
//   try {
//     // Ensure that the page number and limit are valid
//     if (page < 1 || limit < 1) {
//       throw new Error('Invalid page or limit parameter');
//     }

//     // Calculate the total number of records
//     const totalReports = await prisma.corporateReport.count();

//     // Calculate the total number of pages
//     const totalPages = Math.ceil(totalReports / limit);

//     // Ensure the current page is not greater than the total pages
//     // if (page > totalPages) {
//     //   throw new Error('Page number exceeds total pages');
//     // }

//     // Calculate the number of records to skip
//     const skip = (page - 1) * limit;

//     // Fetch the paginated reports
//     const reports = await prisma.corporateReport.findMany({
//       skip: skip,
//       take: limit,
//       orderBy: {
//         createdAt: 'desc', // Ordering by the creation date, most recent first
//       },
//     });

//     // Determine if previous and next pages exist
//     const PrevPageExists = page > 1;
//     const NextPageExists = page < totalPages;

//     // Return the paginated reports and metadata
//     return {
//       reports,
//       NextPageExists,
//       PrevPageExists,
//       totalPages,
//       currentPage: page,
//     };
//   } catch (error) {
//     console.error('Error fetching corporate reports with pagination:', error);
//     throw new Error('Failed to fetch corporate reports');
//   }
// }

export async function getPaginatedCorporateReports(
  page: number = 1,
  limit: number = 10
): Promise<{
  reports: any[];
  NextPageExists: boolean;
  PrevPageExists: boolean;
  totalPages: number;
  currentPage: number;
}> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set session using sessionNamespace
        sessionNamespace.set("session", {
          user: await getSession(), // Assuming getSession() retrieves the current session
        });

        // Ensure that the page number and limit are valid
        if (page < 1 || limit < 1) {
          throw new Error('Invalid page or limit parameter');
        }

        // Calculate the total number of records
        const totalReports = await prisma.corporateReport.count();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalReports / limit);

        // Calculate the number of records to skip
        const skip = (page - 1) * limit;

        // Fetch the paginated reports
        const reports = await prisma.corporateReport.findMany({
          skip: skip,
          take: limit,
          orderBy: {
            createdAt: 'desc', // Ordering by the creation date, most recent first
          },
        });

        // Determine if previous and next pages exist
        const PrevPageExists = page > 1;
        const NextPageExists = page < totalPages;

        // Resolve with paginated reports and metadata
        resolve({
          reports,
          NextPageExists,
          PrevPageExists,
          totalPages,
          currentPage: page,
        });
      } catch (error) {
        console.error('Error fetching corporate reports with pagination:', error);
        reject(new Error('Failed to fetch corporate reports'));
      }
    });
  });
}


// export async function getPaginatedCorporateReportsForClient(page: number = 1, limit: number = 10) {
//   try {
//     // Ensure that the page number and limit are valid
//     if (page < 1 || limit < 1) {
//       throw new Error('Invalid page or limit parameter');
//     }

//     // Calculate the total number of records
//     const totalReports = await prisma.corporateReport.count();

//     // Calculate the total number of pages
//     const totalPages = Math.ceil(totalReports / limit);

//     // Ensure the current page is not greater than the total pages
//     // if (page > totalPages) {
//     //   throw new Error('Page number exceeds total pages');
//     // }

//     // Calculate the number of records to skip
//     const skip = (page - 1) * limit;

//     // Fetch the paginated reports
//     const reports = await prisma.corporateReport.findMany({
//       skip: skip,
//       take: limit,
//       orderBy: {
//         createdAt: 'desc', // Ordering by the creation date, most recent first
//       },
//       where: {
//         isPublished : true
//       }
//     });

//     // Determine if previous and next pages exist
//     const PrevPageExists = page > 1;
//     const NextPageExists = page < totalPages;

//     // Return the paginated reports and metadata
//     return {
//       reports,
//       NextPageExists,
//       PrevPageExists,
//       totalPages,
//       currentPage: page,
//     };
//   } catch (error) {
//     console.error('Error fetching corporate reports with pagination:', error);
//     throw new Error('Failed to fetch corporate reports');
//   }
// }
interface PaginatedCorporateReports {
  reports: any;
  NextPageExists: boolean;
  PrevPageExists: boolean;
  totalPages: number;
  currentPage: number;
}

// Updated function with Promise<PaginatedCorporateReports> as the return type
export async function getPaginatedCorporateReportsForClient(page: number = 1, limit: number = 10): Promise<PaginatedCorporateReports> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Retrieve session from the context and store it in sessionNamespace
        sessionNamespace.set("session", {
          user: await getSession(),
        });

        // Ensure that the page number and limit are valid
        if (page < 1 || limit < 1) {
          throw new Error('Invalid page or limit parameter');
        }

        // Calculate the total number of records
        const totalReports = await prisma.corporateReport.count({
          where: {
            isPublished: true, // Ensure only published reports are counted
          },
        });

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalReports / limit);

        // Calculate the number of records to skip
        const skip = (page - 1) * limit;

        // Fetch the paginated reports
        const reports = await prisma.corporateReport.findMany({
          skip: skip,
          take: limit,
          orderBy: {
            createdAt: 'desc', // Ordering by the creation date, most recent first
          },
          where: {
            isPublished: true, // Only fetch published reports
          },
        });

        // Determine if previous and next pages exist
        const PrevPageExists = page > 1;
        const NextPageExists = page < totalPages;

        // Resolve with paginated reports and metadata
        resolve({
          reports,
          NextPageExists,
          PrevPageExists,
          totalPages,
          currentPage: page,
        });
      } catch (error) {
        console.error('Error fetching corporate reports with pagination:', error);
        reject(new Error('Failed to fetch corporate reports'));
      }
    });
  });
}




// For Corporate Report Published status
// export async function togglePublished(reportId: number) {
//   try {
//     // Fetch the existing report
//     const existingReport = await prisma.corporateReport.findUnique({
//       where: { id: reportId },
//     });

//     if (!existingReport) {
//       throw new Error('Report not found');
//     }

//     // Toggle the isPublished status
//     const updatedReport = await prisma.corporateReport.update({
//       where: { id: reportId },
//       data: { isPublished: !existingReport.isPublished },
//     });

//     return updatedReport;
//   } catch (error) {
//     console.error('Error updating report:', error);
//     throw new Error('Error updating report');
//   }
// }

export async function togglePublished(reportId: number): Promise<any> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set session using sessionNamespace
        sessionNamespace.set("session", {
          user: await getSession(), // Assuming getSession() retrieves the current session
        });

        // Fetch the existing report
        const existingReport = await prisma.corporateReport.findUnique({
          where: { id: reportId },
        });

        if (!existingReport) {
          throw new Error('Report not found');
        }

        // Toggle the isPublished status
        const updatedReport = await prisma.corporateReport.update({
          where: { id: reportId },
          data: { isPublished: !existingReport.isPublished },
        });

        // Resolve with the updated report
        resolve(updatedReport);
      } catch (error: any) {
        console.error('Error updating report:', error.message);
        reject(new Error('Error updating report: ' + error.message));
      }
    });
  });
}


interface AdminDashboardDetails {
  corporateScore: number;
  numberOfDepartmentsRated: number;
  totalRespondents: number;
  totalResponses: number;
  totalLikes: number;
  totalDislikes: number;
  totalImprovements: number;
}


export async function getDetailsForAdminDashboard(quarter: number, year: number) : Promise<AdminDashboardDetails>{
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Retrieve session from the context
        const session = await getSession();
        sessionNamespace.set("session", {
          user: session
        });

        // Fetch all published department rankings for the specified year and quarter
        const departmentRankings = await prisma.departmentRanking.findMany({
          where: {
            year: year,
            quarter: quarter,
            isPublished: true, // Only fetch published rankings
          },
          select: {
            departmentId: true,
            averageRating: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        });

        // If no department rankings exist, return default values
        if (departmentRankings.length === 0) {
          resolve({
            corporateScore: 0,
            numberOfDepartmentsRated: 0,
            totalRespondents: 0,
            totalResponses: 0,
            totalLikes: 0,
            totalDislikes: 0,
            totalImprovements: 0,
          });
          return;
        }

        // Calculate the corporate score
        const totalAverageRating = departmentRankings.reduce((sum, ranking) => sum + ranking.averageRating, 0);
        const corporateScore = parseFloat((totalAverageRating / departmentRankings.length).toFixed(2));

        // Fetch ratings for the same year and quarter
        const ratings = await prisma.rating.findMany({
          where: {
            year: year,
            quarter: quarter,
            excludeFromAverage: false
          },
          select: {
            likes: true,
            dislikes: true,
            improvements: true,
            stars: true,
            excludeFromAverage: true, // To exclude certain ratings from the average
            ratedByUserId: true,
          },
        });

        // Filter valid ratings for the corporate score (excluding those with `excludeFromAverage: true`)
        const validRatings = ratings.filter((rating) => !rating.excludeFromAverage);

        // Count the number of departments rated
        const numberOfDepartmentsRated = departmentRankings.length;

        // Calculate total respondents (unique users who rated)
        const totalRespondents = new Set(ratings.map((rating) => rating.ratedByUserId)).size;

        // Calculate total responses (number of ratings)
        const totalResponses = ratings.length;

        // Calculate total likes, dislikes, and improvements
        const totalLikes = ratings.reduce((sum, rating) => sum + (rating.likes?.trim() ? 1 : 0), 0);
        const totalDislikes = ratings.reduce((sum, rating) => sum + (rating.dislikes?.trim() ? 1 : 0), 0);
        const totalImprovements = ratings.reduce((sum, rating) => sum + (rating.improvements?.trim() ? 1 : 0), 0);

        resolve({
          corporateScore,
          numberOfDepartmentsRated,
          totalRespondents,
          totalResponses,
          totalLikes,
          totalDislikes,
          totalImprovements,
        });
      } catch (error) {
        console.error('Error fetching corporate score:', error);
        reject(new Error('Error fetching corporate score data'));
      }
    });
  });
}



type FetchAuditTrailLogsParams = {
  page?: number; // Page number for pagination
  pageSize?: number; // Number of entries per page
  startDate?: Date; // Optional start date for date range filtering
  endDate?: Date; // Optional end date for date range filtering
  models?: string[]; // Optional filter for userName
  actionType?: string[]; // Optional filter for actionType
};

export async function fetchAuditTrailLogs({
  page = 1,
  pageSize = 50,
  startDate,
  endDate,
  models=[],
  actionType=[],
}: FetchAuditTrailLogsParams) {
  const skip = (page - 1) * pageSize;
  
  // Construct the "where" clause for the filters
  const whereClause: any = {};
  
  // Add date range filters if provided
  if (startDate && endDate) {
    whereClause.timestamp = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  } else if (startDate) {
    whereClause.timestamp = {
      gte: new Date(startDate),
    };
  } else if (endDate) {
    whereClause.timestamp = {
      lte: new Date(endDate),
    };
  }

  // Add actionType filter if provided
  if (actionType.length > 0) {
    whereClause.actionType = {
      in: actionType, // Filter by selected action types
    };
  }

  // Add models filter if provided
  if (models.length > 0) {
    whereClause.model = {
      in: models, // Filter by selected models
    };
  }

  try {
    // Fetch the total count of entries matching the filters
    const totalCount = await prisma.auditTrailLog.count({
      where: whereClause,
    });

    // Fetch the data with pagination and filters
    const logs = await prisma.auditTrailLog.findMany({
      where: whereClause,
      skip,
      take: pageSize,
      orderBy: {
        timestamp: 'desc', // Sort by the most recent entries
      },
    });

    return {
      logs, // The fetched logs
      totalPages: Math.ceil(totalCount / pageSize), // Calculate total pages
      currentPage: page, // Current page
      totalEntries: totalCount, // Total count of matching entries
    };
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    throw new Error('Failed to fetch audit logs');
  }
}

// Updates Ending


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



// Get the IDs of the Department Ranking
// export async function getDepartmentRankingIds( quarter = 0, year = 0 ) {
//   try {
//     const today = new Date();
//     const currentYear = year || today.getFullYear();
//     const currentQuarter = quarter || Math.ceil((today.getMonth() + 1) / 3);

//     // Fetch IDs of department rankings for the specified or current year and quarter
//     const departmentRankingIds = await prisma.departmentRanking.findMany({
//       where: {
//         year: currentYear,
//         quarter: currentQuarter,
//       },
//       select: {
//         id: true,
//       },
//     });

//     if (departmentRankingIds.length === 0) {
//       return departmentRankingIds;
//     }
  

//     return departmentRankingIds.map(ranking => ranking.id) 
    
//   } catch (error) {
//     console.error(error);
//     throw new Error('An error occurred fetching department ranking IDs');
//   }
// }
export async function getDepartmentRankingIds(quarter = 0, year = 0): Promise<number[]> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set the session inside the namespace
        const session = await getSession();
        sessionNamespace.set("session", { user: session });

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

        // If no rankings are found, resolve with an empty array
        if (departmentRankingIds.length === 0) {
          resolve([]);
          return;
        }

        // Map the department rankings to return only the IDs
        const rankingIds = departmentRankingIds.map(ranking => ranking.id);

        // Resolve with the array of ranking IDs
        resolve(rankingIds);
      } catch (error) {
        console.error('An error occurred fetching department ranking IDs:', error);
        reject(new Error('An error occurred fetching department ranking IDs'));
      }
    });
  });
}


interface TogglePublishedStatusParams {
  departmentRankingIds: number[];
}

// export async function togglePublishedStatus({ departmentRankingIds }: TogglePublishedStatusParams) {
//   try {
//     // Fetch the current isPublished status of the given IDs
//     const rankings = await prisma.departmentRanking.findMany({
//       where: {
//         id: {
//           in: departmentRankingIds,
//         },
//       },
//       select: {
//         id: true,
//         isPublished: true,
//       },
//     });

//     if (rankings.length === 0) {
//       throw new Error('No department rankings found for the provided IDs.');
//     }

//     // Toggle the isPublished status
//     const updatedRankings = await Promise.all(
//       rankings.map(async (ranking) => {
//         return prisma.departmentRanking.update({
//           where: { id: ranking.id },
//           data: { isPublished: !ranking.isPublished },
//         });
//       })
//     );

//     return {
//       updatedRankings,
//     };
//   } catch (error) {
//     console.error(error);
//     throw new Error('An error occurred while toggling the published status');
//   }
// }

export async function togglePublishedStatus({
  departmentRankingIds,
}: TogglePublishedStatusParams): Promise<{ updatedRankings: any[] }> {
  return new Promise((resolve, reject) => {
    sessionNamespace.run(async () => {
      try {
        // Set session using sessionNamespace
        sessionNamespace.set("session", {
          user: await getSession(), // Assuming getSession() retrieves the current session
        });

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

        resolve({
          updatedRankings,
        });
      } catch (error) {
        console.error('An error occurred while toggling the published status:', error);
        reject(new Error('An error occurred while toggling the published status'));
      }
    });
  });
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


export async function getRatingsForTheQuarterAndYear(quarterInput?: number,yearInput?: number) {
  try {
    const today = new Date();
    const currentYear = yearInput || today.getFullYear();
    const currentQuarter = quarterInput || Math.ceil((today.getMonth() + 1) / 3);

    const ratings = await prisma.rating.findMany({
      where: {
        year: currentYear,
        quarter: currentQuarter
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