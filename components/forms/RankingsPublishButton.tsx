"use client"
import { getPublishedState, togglePublishedStatus } from '@/lib/actions';
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button';

const RankingsPublishButton = ({departmentRankingIds}:{departmentRankingIds: any}) => {
    const [publishedButtonState, setpublishedButtonState] = useState<'Publish' | 'Unpublish'>('Publish')

  
    // Fetch the initial published state when the component mounts
  useEffect(() => {
    const fetchPublishedState = async () => {
      try {
        const { rankings } = await getPublishedState({ departmentRankingIds });
        const allPublished = rankings.every(ranking => ranking.isPublished);
        setpublishedButtonState(allPublished ? 'Unpublish' : 'Publish');
      } catch (error) {
        console.error('Error fetching initial published state:', error);
      }
    };

    fetchPublishedState();
  }, [departmentRankingIds]);


    const handleClick = async()=> {
        const {updatedRankings} = await togglePublishedStatus({departmentRankingIds})
        const allPublished = updatedRankings.every(ranking => ranking.isPublished);
        setpublishedButtonState(allPublished ? 'Unpublish' : 'Publish');
    }

  return (
    <Button variant={publishedButtonState === 'Unpublish' ?  'outline': 'default'} className="w-fit content-center" onClick={handleClick}>{publishedButtonState}</Button>
  )
}

export default RankingsPublishButton