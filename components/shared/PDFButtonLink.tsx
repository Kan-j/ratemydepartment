"use client"
import React from 'react'
import DepartmentReportPDF from './DepartmentReportPDF'
// import { PDFDownloadLink } from '@react-pdf/renderer'

import dynamic from 'next/dynamic';

const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), { ssr: false });

interface PDFButtonLinkProps {
  departmentalScore: number;
  departmentStarCount: Record<string, number>;
  likes: string[];
  dislikes: string[];
  improvements: string[];
  departmentName: string;
  year: number;
  quarter: number;
  satisfactionImageUrl: string;
  performanceTrendImageUrl: string;
}



const PDFButtonLink: React.FC<PDFButtonLinkProps> = (props) => {
  return (
    // <PDFDownloadLink document={<DepartmentReportPDF />} fileName="somename.pdf">
    <PDFDownloadLink
    className='bg-blue-500 px-3 text-gray-100 py-2 rounded-lg hover:bg-blue-700 hover:text-white'
    document={<DepartmentReportPDF {...props} />}
    fileName={`${props.departmentName}_Report_Q${props.quarter}_${props.year}.pdf`}
  >
        {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 'Download now!'
        }
    </PDFDownloadLink>)
}

export default PDFButtonLink