import React from 'react'
import SingleReportListItem from '../cards/SingleReportListItem'
import ReportsPagination from '../cards/ReportsPagination'
import axios from 'axios'
import { getUserDepartment } from '@/lib/actions';



// Define the type for the star count (since it's an object, we'll assume its structure)
interface StarCount {
  [key: string]: number;
}

interface ReportData {
  departmentalScore: number;
  departmentStarCount: { starCount: StarCount };
  likes: string[];
  dislikes: string[];
  improvements: string[];
  departmentName: string;
  id: number;
  departmentId: number;
  year: number;
  quarter: number;
  satisfactionImageUrl: string;
  performanceTrendImageUrl: string;
  likertTargetScore: number;
  createdAt: string;
  updatedAt: string;
}


const MyDepartmentReports = async({page}:{page: number}) => {

  const mydepartmentId = await getUserDepartment()
  const response = await axios.post(
    `http://localhost:3000/api/reports/departments/${mydepartmentId}`,
    {
      page: page,
      limit: 10
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
 
  const {reports,PrevPageExists, NextPageExists, totalPages, currentPage} = response.data;
  
  
  return (
    <section className="">
        <section className=" w-full flex flex-col gap-3 p-3 rounded-lg">
            {reports && reports.length > 0 ? reports.map((report:ReportData, index:number) => (
              <SingleReportListItem key={index} reportData={report} />
            )): (
              <h1 className="">No reports found.</h1>
            )}
        </section>
        <section className="w-full ">
            <section className="w-3/4 justify-center items-center mt-2 mb-6">
                <ReportsPagination NextPageExists={NextPageExists} PrevPageExists={PrevPageExists} currentPage={currentPage} totalPages={totalPages}/>
            </section>
        </section>
    </section>
  )
}

export default MyDepartmentReports