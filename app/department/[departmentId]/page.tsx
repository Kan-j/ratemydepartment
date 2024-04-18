import DepartmentDetail from '@/components/forms/DepartmentDetailForm';
import {getDepartmentDetails} from '@/lib/actions';
import React from 'react'

interface Props {
    params: {
        departmentId : string
    }
}

const Page = async({params}: Props) => {
    const departmentId = params.departmentId;
    
    const id = parseInt(departmentId)

    const {
        department,
        totalRatings,
        starsCount,
        averageStars,
      } = await getDepartmentDetails(id) as {
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



export default Page