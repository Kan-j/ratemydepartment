import CommentCard from '@/components/cards/CommentCard';
import RatingDistribution from '@/components/cards/RatingDistribution';
import DepartmentDetail from '@/components/shared/DepartmentDetailForm';
import QuarterSelector from '@/components/shared/QuarterSelector';
import {getDepartmentDetails, getDepartmentDetailsForAdmin} from '@/lib/actions';
import { getServerSession } from 'next-auth';
import React from 'react'

interface Props {
    params: {
        departmentId : string
    },
    searchParams: { [key: string]: string | undefined }
}

interface DepartmentDetails {
  department: any; // Define the type of department object
  totalRatings: number;
  starsCount: any;
  averageStars: number;
}


const DepartmentDetailPage = async({params, searchParams}: Props) => {
  const departmentId = params.departmentId;

  const id = parseInt(departmentId)
  const q = parseInt(searchParams['q'] || '')
  const y = parseInt(searchParams['y'] || '')

  const session = await getServerSession()
  const email = session?.user?.email
  const response = await fetch(`http://127.0.0.1:3000/api/department?email=${email}`)
  const  userDetails= await response.json()
  const {departmentId: mydepartmentId} = userDetails.user
  
  if(id === mydepartmentId) {
    const result = await getDepartmentDetailsForAdmin(id, q, y) as DepartmentDetails;
    const { department, totalRatings, starsCount, averageStars } = result;
    const publishedRatings = department.ratings.filter((rating: any) => rating.isPublished);
    const publishedRatingsLength = publishedRatings.length;
    return(
      <div className='flex flex-col w-full mx-auto lg:pl-10 md:pl-6 md:pt-10 lg:pt-20'>
          <section className="flex flex-col gap-4 justify-end mb-6 md:mb-0 md:hidden">
            <section className="flex justify-end">
              <QuarterSelector screen="small"/>
            </section>
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
            <section className="grid grid-cols-2 mt-12 mb-6">
              <h1 className="text-xl md:text-2xl text-gray-700 font-semibold">Comments ({department.ratings.length})</h1>
            </section>

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


  const {
      department,
      totalRatings,
      starsCount,
      averageStars,
    } = await getDepartmentDetails(id,q,y) as {
      department: { id: number; name: string; ratings: { id: number; stars: number; }[]; };
      totalRatings: number;
      starsCount: any;
      averageStars: number;
    };
  

  return (
    <section className='w-full'>
        <DepartmentDetail department={department} totalRatings={totalRatings} starsCount={starsCount} averageStars={averageStars}  />
    </section>
  )
}



export default DepartmentDetailPage