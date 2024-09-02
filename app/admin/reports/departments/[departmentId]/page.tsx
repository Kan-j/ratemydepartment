import SingleReportListItem from '@/components/cards/SingleReportListItem'
import axios from 'axios'
import React from 'react'
import ReportsPagination from '@/components/cards/ReportsPagination';

interface Params {
    params:{
      departmentId : string
    },
    searchParams: { [key: string]: string | undefined },
}

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

const DepartmentReports = async({params,searchParams}:Params) => {
  const departmentIdInt = parseInt(params.departmentId)
  const page = parseInt(searchParams['page'] || '1')

  const response = await axios.post(
    `http://localhost:3000/api/reports/departments/${departmentIdInt}`,
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

  const departmentName = reports?.length > 0 ? reports[0].departmentName : 'Department';

  return (
    <section className='flex flex-col'>
        <section className="">
            <h1 className="text-3xl font-semibold text-gray-800 mb-3">{departmentName} Reports</h1>
  
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
  
        </section>
    </section>
  )
}

export default DepartmentReports