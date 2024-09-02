import { generateAndSavePerformanceTrendChart, generateAndSaveSatisfactionLevelChart, getDepartmentQuarterlyAverages, getDepartmentQuarterlyAveragesUpToQuarter, getDepartmentStarCount, getRatingsForDepartmentalReport } from '@/lib/actions';
import prisma from '@/lib/prisma';
import { endOfQuarter, addDays, isAfter, getQuarter, getYear } from 'date-fns';



export async function POST(
  request: Request,
  { params }: { params: { departmentId: string } }
) {
  try {
    const { page = 1, limit = 10 } = await request.json();
    const departmentId = parseInt(params.departmentId);

    if (!departmentId || page < 1 || limit < 1) {
      return new Response(
        JSON.stringify({ error: 'Invalid parameters' }),
        { status: 400 }
      );
    }

    // Configurable start quarter and year
    const startYear = 2024;
    const startQuarter = 2; // Q2

    const today = new Date();
    const currentYear = getYear(today);
    const currentQuarter = getQuarter(today);

    // Calculate total number of quarters since the start point to the current quarter
    const totalQuartersSinceStart =
      (currentYear - startYear) * 4 + (currentQuarter - startQuarter + 1);

    // Calculate the start point for pagination
    const startIndex = (page - 1) * limit;

    // Determine the total number of pages
    const totalPages = Math.ceil(totalQuartersSinceStart / limit);

    // Determine if there are previous and next pages
    const PrevPageExists = page > 1;
    const NextPageExists = page < totalPages;

    // Ensure we don't go before the start quarter/year
    if (startIndex >= totalQuartersSinceStart) {
      return new Response(
        JSON.stringify({ error: 'No more reports available.' ,NextPageExists,
          PrevPageExists,
          totalPages,
          currentPage: page,}),
        { status: 200 }
      );
    }

    const reports = [];

    for (let i = 0; i < limit; i++) {
      const offsetIndex = startIndex + i;
      if (offsetIndex >= totalQuartersSinceStart) break;

      // Calculate the report's year and quarter based on the offset from the start quarter
      const reportYear = startYear + Math.floor((startQuarter - 1 + offsetIndex) / 4);
      const reportQuarter = ((startQuarter - 1 + offsetIndex) % 4) + 1;

      // Check if today is less than 10 days past the end of the current quarter
      if (
        reportYear === currentYear &&
        reportQuarter === currentQuarter &&
        isAfter(addDays(endOfQuarter(today), 10), today)
      ) {
        continue; // Skip generating the report for the latest quarter if it's within 10 days of the quarter's end
      }

      // Check if a report already exists for the given department, year, and quarter
      let existingReport = await prisma.departmentReport.findFirst({
        where: {
          departmentId,
          year: reportYear,
          quarter: reportQuarter,
        },
      });

      if (!existingReport) {
        const departmentAverages = await getDepartmentQuarterlyAveragesUpToQuarter(departmentId,reportYear, reportQuarter);
        const departmentStarCount = await getDepartmentStarCount(departmentId, reportQuarter, reportYear);
        
        const departmentScoreEntry = departmentAverages.find(
          entry => entry.quarter === `Q${reportQuarter}` && entry.year === reportYear
        );
        const departmentalScore = departmentScoreEntry ? departmentScoreEntry.value : null;
        const { likes, dislikes, improvements, departmentName } = await getRatingsForDepartmentalReport(departmentId, reportQuarter, reportYear);

        const performanceTrendImageUrl = await generateAndSavePerformanceTrendChart(
          departmentId,
          reportYear,
          departmentAverages
        );

        const satisfactionLevelChartUrl = await generateAndSaveSatisfactionLevelChart(
          departmentId,
          reportQuarter,
          reportYear,
          departmentStarCount.starCount
        );

        const newReport = await prisma.departmentReport.create({
          data: {
            departmentId,
            year: reportYear,
            quarter: reportQuarter,
            satisfactionImageUrl: satisfactionLevelChartUrl,
            performanceTrendImageUrl,
            likertTargetScore: 4.0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        reports.push({
          departmentalScore,
          departmentStarCount,
          likes,
          dislikes,
          improvements,
          departmentName,
          ...newReport,
        });
      } else {
        const departmentAverages = await getDepartmentQuarterlyAverages(departmentId);
        const departmentStarCount = await getDepartmentStarCount(departmentId, reportQuarter, reportYear);
        
        const departmentScoreEntry = departmentAverages.find(
          entry => entry.quarter === `Q${reportQuarter}` && entry.year === reportYear
        );
        const departmentalScore = departmentScoreEntry ? departmentScoreEntry.value : null;
        const { likes, dislikes, improvements, departmentName } = await getRatingsForDepartmentalReport(departmentId, reportQuarter, reportYear);

        reports.push({
          departmentalScore,
          departmentStarCount,
          likes,
          dislikes,
          improvements,
          departmentName,
          ...existingReport,
        });
      }
    }

    return new Response(JSON.stringify({reports,NextPageExists,
      PrevPageExists,
      totalPages,
      currentPage: page}), { status: 200 });
  } catch (error: any) {
    console.error('Error generating or updating reports:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate or update reports: ' + error.message }),
      { status: 500 }
    );
  }
}




// export async function POST(
//   request: Request,
//   { params }: { params: { departmentId: string } }
// ) {
//   try {
//     const { year, quarter } = await request.json();

//     if (!year || !quarter || !params.departmentId) {
//       return new Response(
//         JSON.stringify({ error: 'Missing required fields' }),
//         { status: 400 }
//       );
//     }

//     const departmentId = parseInt(params.departmentId);
//     const currentQuarterEndDate = endOfQuarter(new Date(year, (quarter - 1) * 3));
//     const reportGenerationDate = addDays(currentQuarterEndDate, 7);
//     const today = new Date();


//     // If today is before the reportGenerationDate, do not generate a report
//     // if (isAfter(reportGenerationDate, today)) {
//     //   return new Response(
//     //     JSON.stringify({ message: 'It is not time to generate the report yet.' }),
//     //     { status: 400 }
//     //   );
//     // }

//     // Check if a report already exists for the given department, year, and quarter
//     let existingReport = await prisma.departmentReport.findFirst({
//       where: {
//         departmentId,
//         year,
//         quarter,
//       },
//     });


//     // *****Fetching other things needed fr the report*******
//     // Fetch the quarterly averages
//     const departmentAverages = await getDepartmentQuarterlyAverages(departmentId);
//     const departmentStarCount = await getDepartmentStarCount(1,quarter, year)

//     // Find the value for the current quarter and year
//     const departmentScoreEntry = departmentAverages.find(
//       entry => entry.quarter === `Q${quarter}` && entry.year === year
//     );
//     const departmentalScore = departmentScoreEntry ? departmentScoreEntry.value : null;
//     const {likes, dislikes, improvements,departmentName}= await getRatingsForDepartmentalReport(departmentId, quarter, year)

//     // *****Fetching other things needed fr the report*******


//     if (!existingReport) {

//       // Generate and save the performance trend chart using the server action
//       const performanceTrendImageUrl = await generateAndSavePerformanceTrendChart(
//         departmentId,
//         year,
//         departmentAverages
//       );
      
//       const satisfactionLevelChartUrl= await generateAndSaveSatisfactionLevelChart(departmentId,quarter,year,departmentStarCount.starCount)

//       // // If the report does not exist, create a new one
//       const newReport = await prisma.departmentReport.create({
//         data: {
//           departmentId,
//           year,
//           quarter,
//           satisfactionImageUrl: satisfactionLevelChartUrl,
//           performanceTrendImageUrl,
//           likertTargetScore: 4.0,
//           createdAt: today,
//           updatedAt: today,
//         },
//       });

//       // return new Response(JSON.stringify(newReport), { status: 201 });
//       return new Response(JSON.stringify({ departmentalScore, departmentStarCount, likes, dislikes, improvements, departmentName, ...newReport}), { status: 201 });
//     }

//     return new Response(JSON.stringify({departmentalScore, departmentStarCount, likes, dislikes, improvements, departmentName,...existingReport}), { status: 200 });
//   } catch (error: any) {
//     console.error('Error generating or updating report:', error);
//     return new Response(
//       JSON.stringify({ error: 'Failed to generate or update report: ' + error.message }),
//       { status: 500 }
//     );
//   }
// }