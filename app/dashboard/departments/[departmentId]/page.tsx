import React from "react";
import { getDepartmentDetailsForQuarterAndYear, getUserDepartment } from '@/lib/actions';
import QuarterSelector from "@/components/shared/QuarterSelector";
import RatingDistribution from '@/components/cards/RatingDistribution';
import SearchBar from "@/components/forms/SearchBar";
import CommentsSection from "@/components/shared/CommentsSection";
import { getServerSession } from "next-auth";



interface Params {
  params:{
    departmentId : string
  },
  searchParams: { [key: string]: string | undefined },
  
}


interface DepartmentDetails {
  department: any; // Define the type of department object
  totalRatings: number;
  starsCount: any;
  averageStars: number;
}



const UserDepartmentDetails = async({params, searchParams}:Params) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentQuarter = Math.ceil((today.getMonth() + 1) / 3); 
  const q = parseInt(searchParams['q'] || '')|| currentQuarter
  const y = parseInt(searchParams['y'] || '')|| currentYear
  const page = parseInt(searchParams['page'] || '1')
  const sort = searchParams['sort'] || 'desc'

  const departmentIdInt = parseInt(params.departmentId)
  const result = await getDepartmentDetailsForQuarterAndYear(departmentIdInt, q, y) as DepartmentDetails;
  // SESSION ADDED
  const mydepartmentId = await getUserDepartment()
  const isMyDepartment = mydepartmentId === departmentIdInt;

  // Now TypeScript knows the structure of the returned object
  const { department, totalRatings, starsCount, averageStars } = result;
  
    

  return (
    <div className='flex flex-col'>
      <section className="flex flex-col gap-4 justify-end mb-6 md:mb-0 md:hidden">
        <section className="flex justify-end">
          <QuarterSelector screen="small"/>
        </section>
      </section>

      <section className="flex flex-col  justify-end mb-6 md:mb-0 ">
        <section className="flex justify-end w-2/6 ">
          <SearchBar/>
        </section>
        <div className="border-b pb-4 mb-2 w-4/5"/>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0">
          <section className="w-full mx-auto">
              <h1 className="text-gray-700 text-2xl md:text-3xl lg:text-4xl font-bold mb-3">{department.name}</h1>
              <div className="">
                  <h1 className="text-2xl md:text-4xl lg:text-6xl text-gray-600 mb-1 md:mb-2 font-bold">{averageStars}</h1>
              </div>
              <h1 className="text-gray-500 md:text-base text-sm font-medium">Overall Quality Based on <span className="underline">
                  {totalRatings} ratings</span></h1>
          </section>
          <RatingDistribution starsCount={starsCount}/>
      </section>

      <CommentsSection departmentId={departmentIdInt} currentPage={page} quarter={q} year={y} sort={sort} isMyDepartment={isMyDepartment} isAdmin={false}/>
    </div>
  )
}

export default UserDepartmentDetails