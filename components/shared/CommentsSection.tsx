import { getCommentsPaginationForAdmin, getCommentsPaginationForRegularUsers, getDepartmentRatingsForQuarter } from '@/lib/actions';
import React from 'react'
import CommentsPagination from '../cards/CommentsPagination';
import CommentHeader from '../headers/CommentHeader';
import CommentCard from '../cards/CommentCard';

interface CommentsSectionProps {
    departmentId: number;
    quarter: number;
    year: number;
    currentPage: number;
    sort: any;
    isMyDepartment: boolean,
    isAdmin: boolean,

}

const CommentsSection = async({ departmentId, quarter, year, currentPage, sort, isMyDepartment,isAdmin }: CommentsSectionProps) => {
  // Fetch the comments data

  // For Regular Users
  if(!isAdmin){
    const { ratings, totalPages, hasNextPage, hasPreviousPage,totalRatingsCount } = await getCommentsPaginationForRegularUsers(departmentId, quarter, year, currentPage, 10,sort);

    return (
      <section className='flex flex-col'>
          <CommentHeader ratingsLength={totalRatingsCount} isMyDepartment={isMyDepartment} quarter={quarter} year={year} departmentId={departmentId}/>
          <article className="flex flex-col gap-4">
          {ratings.map((rating: any, index: number) => (
            <CommentCard key={index} rating={rating} isAdmin={isAdmin} />
          ))}
          </article>
  
          <section className='w-full flex justify-center'>
              <CommentsPagination totalPages={totalPages} NextPageExists={hasNextPage} PrevPageExists={hasPreviousPage} currentPage={currentPage}/>
          </section>
          
      </section>
    )
  }
  


  // For Admins
  const { ratings, totalPages, hasNextPage, hasPreviousPage,totalRatingsCount } = await getCommentsPaginationForAdmin(departmentId, quarter, year, currentPage, 10,sort);

  return (
    <section className='flex flex-col'>
        <CommentHeader ratingsLength={totalRatingsCount} isMyDepartment={isMyDepartment} isAdmin={isAdmin} quarter={quarter} year={year} departmentId={departmentId}/>
        <article className="flex flex-col gap-4">
        {ratings.map((rating: any, index: number) => (
          <CommentCard key={index} rating={rating} isAdmin={isAdmin} />
        ))}
        </article>

        <section className='w-full flex justify-center'>
            <CommentsPagination totalPages={totalPages} NextPageExists={hasNextPage} PrevPageExists={hasPreviousPage} currentPage={currentPage}/>
        </section>
        
    </section>
  )
}

export default CommentsSection