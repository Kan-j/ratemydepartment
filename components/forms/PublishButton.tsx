"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { toggleRatingPublished, getCommentsPublishedState } from '@/lib/actions';


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

    useEffect(() => {
      const fetchPublishedState = async () => {
        try {
          const { ratings } = await getCommentsPublishedState({ratingIds} );
          const allPublished = ratings.every(rating => rating.isPublished);
          setpublishedButtonState(allPublished ? 'Unpublish' : 'Publish');
        } catch (error) {
          console.error('Error fetching initial published state:', error);
        }
      };
  
      fetchPublishedState();
    }, [ratingIds]);

    const handleClick = async () => {
      try {
        const ratings = await toggleRatingPublished({ ratingIds });
        const allPublished = ratings.every(rating => rating.isPublished);
        setpublishedButtonState(allPublished ? 'Unpublish' : 'Publish');
      } catch (error) {
        console.error('Error toggling published status:', error);
      }
    };
  return (
    <>
        <Button variant={publishedButtonState === 'Unpublish' ?  'outline': 'default'} className="w-fit content-center" onClick={handleClick}>{publishedButtonState}</Button>
    </>
    
  )
}

export default PublishButton
