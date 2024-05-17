"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { toggleRatingPublished } from '@/lib/actions';
import { FaDownload } from 'react-icons/fa';
import {useCSVDownloader} from 'react-papaparse';

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

const DownloadButton = ({ratingCsvJSON}:any) => {
   const {CSVDownloader, Type} = useCSVDownloader()
    
  return (
    <>
 <CSVDownloader
      type={Type.Button}
      filename={ratingCsvJSON.length > 0 ? ratingCsvJSON[0]['departmentName'] + '_'+ ratingCsvJSON[0]['quarter']+ '_' +ratingCsvJSON[0]['year'] :'file'}
      bom={true}
      className="bg-blue-500 text-slate-50 hover:bg-blue-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 px-3 rounded-md"
      data={ratingCsvJSON}
    >
  <FaDownload/>
    </CSVDownloader>
        
    </>
    
  )
}

export default DownloadButton
