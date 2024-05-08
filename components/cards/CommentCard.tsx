"use client"

import React from 'react'
import CommentsCardItem from './CommentCardItem'
import { Rating } from 'react-simple-star-rating'
import { Button } from '../ui/button'
import { FaPen } from 'react-icons/fa'
import EditComment from '../forms/EditComment'

interface RatingDetails {
  showEdit: boolean,
  key:number,
  rating: {
  id: number;
  stars: number;
  ratedByUserId: number;
  likes: string;
  dislikes: string;
  improvements: string;
  isPublished: boolean;
  ratedByUser: {
    id: number;
    name: string;
    departmentId: number;
    department: {
      // Define the structure of the department object if needed
      id: number;
      name: string;
      // Add more properties if necessary
    };
  }};
}

const CommentCard = ({rating, key,showEdit}: RatingDetails) => {

  return (
    <section key={key} className="bg-blue-50 px-4 py-4 rounded-lg md:max-w-[700px] lg:max-w-[980px] xl:max-w-[1000px] 2xl:max-w-[1000px]">
    <div className="flex justify-between md:w-4/5 mb-4 sm:mb-2">
        <div className="flex flex-col sm:flex-row items-baseline sm:gap-4">
          <h1 className="font-bold text-gray-900">{rating?.ratedByUser?.department?.name}</h1>
          <h1 className="text-4xl text-gray-800 hidden sm:flex">.</h1>
          <Rating size={18} initialValue={rating.stars} allowHover={false} readonly={true} allowFraction={true}/>
        </div>
        {showEdit && <EditComment rating={rating}>
          <Button variant="outline" className="rounded-full p-3"><FaPen/></Button>
        </EditComment>}
        
        
    </div>
   <CommentsCardItem title="Likes" description={rating.likes}/>
   <CommentsCardItem title="Dislikes" description={rating.dislikes}/>
   <CommentsCardItem title="Improvements" description={rating.improvements}/>
  </section>
  )
}

export default CommentCard