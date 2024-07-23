
import React from "react";
import { getDepartmentDetailsForAdmin } from '@/lib/actions';
import QuarterSelector from "../../../../components/shared/QuarterSelector";
import RatingDistribution from '@/components/cards/RatingDistribution';
import PublishButton from '@/components/forms/PublishButton';
import DownloadButton from '@/components/forms/DownloadButton';
import CommentCard from '@/components/cards/CommentCard';
import SearchBar from "@/components/forms/SearchBar";
import CommentHeader from "@/components/headers/CommentHeader";

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

  const departmentIdInt = parseInt(params.departmentId)
  const result = await getDepartmentDetailsForAdmin(departmentIdInt, q, y) as DepartmentDetails;

  // Now TypeScript knows the structure of the returned object
  const { department, totalRatings, starsCount, averageStars } = result;

  const publishedRatings = department.ratings.filter((rating: any) => rating.isPublished);
  const publishedRatingsLength = publishedRatings.length;
  const ratingCsvJSON = department.ratings?.map((rating:any) => ({
    stars: rating.stars | 0,
    likes: rating.likes || '',
    dislikes: rating.dislikes || '' ,
    improvements: rating.improvements || '',
    departmentName: department.name || '',
    quarter: rating.quarter || 0,
    year: rating.year || 0,
    ratedBy: rating.ratedByUser.department.name || ''
  }));


  

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

      <article className="flex flex-col">
        <CommentHeader ratingsLength={department.ratings.length} isMyDepartment={true}/>

        <article className="flex flex-col gap-4">
              {department.ratings.map((rating:any, index:any)=> {
                    if(rating.isPublished){
                      return (
                      <CommentCard key={index} rating={rating} showEdit={false}/>
                    )
                  }
              })}
              {publishedRatingsLength == 0 && <h1 className="text-gray-700">Comments not yet published</h1>}
            </article>
      </article>
      
    </div>
  )
}

export default UserDepartmentDetails