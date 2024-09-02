"use client"
import React from 'react'
import { FaDownload } from 'react-icons/fa'
import {useCSVDownloader} from 'react-papaparse';

const RankingsDownloadButton = ({rankingData, quarter,year}:any) => {
  const {CSVDownloader, Type} = useCSVDownloader()

  return (
    <CSVDownloader
    type={Type.Button}
    filename={'Customer_Survey_Ranking_Q'+quarter+ '_'+year}
    bom={true}
    className="bg-blue-500 text-slate-50 hover:bg-blue-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 px-3 rounded-md flex gap-2 items-center py-2"
    data={rankingData}
  >
<FaDownload/>
<span className="">Download</span>
  </CSVDownloader>
  )
}

export default RankingsDownloadButton