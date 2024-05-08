"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { toggleRatingPublished } from '@/lib/actions';
import { Bounce, toast, ToastContainer } from 'react-toastify';

interface RatingList {
    ratings: {
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
    }}[]
  }

const PublishButton = ({ratings}: RatingList) => {
    const ratingIds = ratings.map((rating)=> rating.id)
    const [publishedButtonState, setpublishedButtonState] = useState<'Publish' | 'Unpublish'>('Publish')

    const handleClick = async()=> {
        const ratingsUpdated = await toggleRatingPublished({ratingIds: ratingIds})
        ratingsUpdated[0].isPublished? setpublishedButtonState('Unpublish') : setpublishedButtonState('Publish')
    }
    
  return (
    <>
        <Button variant={publishedButtonState === 'Unpublish' ?  'outline': 'default'} className="w-fit content-center" onClick={handleClick}>{publishedButtonState}</Button>
    </>
    
  )
}

export default PublishButton
