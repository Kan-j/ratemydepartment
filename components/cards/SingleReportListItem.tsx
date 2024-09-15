"use client"
import React, { FC } from 'react'
import { Button } from '../ui/button'
import { FaDownload } from 'react-icons/fa'
import PDFButtonLink from '../shared/PDFButtonLink';
import axios from 'axios'

// Define the type for the star count (since it's an object, we'll assume its structure)
interface StarCount {
  [key: string]: number;
}


interface ReportData {
  departmentalScore: number;
  departmentStarCount: { starCount: StarCount };
  likes: string[];
  dislikes: string[];
  improvements: string[];
  departmentName: string;
  id: number;
  departmentId: number;
  year: number;
  quarter: number;
  satisfactionImageUrl: string;
  performanceTrendImageUrl: string;
  likertTargetScore: number;
  createdAt: string;
  updatedAt: string;
}

interface SingleReportListItemProps {
  reportData: ReportData;
}


const SingleReportListItem: FC<SingleReportListItemProps> = ({ reportData }) => {

  return (
    <section className="flex w-3/4 bg-blue-50 py-2 px-4 rounded-md justify-between items-center">
        <section className="flex">
          <h1 className="bg-blue-500 p-4 font-bold rounded-md text-xl text-white"> {reportData.departmentalScore.toFixed(1)} </h1>
          <section className="ml-4">
            <h1 className="text-gray-600">{reportData.departmentName}</h1>
            <h2 className="font-bold text-gray-800">
              Q{reportData.quarter}, {reportData.year}
            </h2>
        </section>
        </section>
        <section className="">

            
            <PDFButtonLink 
            departmentalScore={reportData.departmentalScore}
            departmentStarCount={reportData.departmentStarCount.starCount}
            likes={reportData.likes}
            dislikes={reportData.dislikes}
            improvements={reportData.improvements}
            departmentName={reportData.departmentName}
            year={reportData.year}
            quarter={reportData.quarter}
            satisfactionImageUrl={reportData.satisfactionImageUrl}
            performanceTrendImageUrl={reportData.performanceTrendImageUrl}/>

        
        </section>
    </section>
  )
}

export default SingleReportListItem