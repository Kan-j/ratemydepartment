import React from 'react'
import CommentsCardItem from './CommentCardItem'
import { Rating } from 'react-simple-star-rating'
import CommentActions from '../forms/CommentActions'
import CommentCardHeader from '../forms/CommentCardHeader';

interface RatingDetails {
  isAdmin: boolean,
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

const CommentCard = ({rating, isAdmin}: RatingDetails) => {
 
  return (
    <section className="bg-blue-50 px-4 py-4 rounded-lg md:max-w-[700px] lg:max-w-[980px] xl:max-w-[1000px] 2xl:max-w-[1000px]">
    <div className="flex justify-between md:w-4/5 mb-4 sm:mb-2">
       <CommentCardHeader rating={rating}/>
        {isAdmin && <CommentActions id={rating.id}/>}
    </div>
   <CommentsCardItem title="Likes" description={rating.likes}/>
   <CommentsCardItem title="Dislikes" description={rating.dislikes}/>
   <CommentsCardItem title="Improvements" description={rating.improvements}/>
  </section>
  )
}

export default CommentCard