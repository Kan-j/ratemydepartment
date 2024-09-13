import React from 'react'
import { FaFile } from 'react-icons/fa';

// Define the type for the report prop
interface SingleCorporateReportListItemProps {
    report: {
      id: number;
      quarter: string;
      year: string;
      fileUrl: string;
      isPublished: boolean;
    };
  }
  

const SingleCorporateReportListClientItem : React.FC<SingleCorporateReportListItemProps> = ({ report }) => {
  return (
    <section className="flex w-3/4 bg-blue-50 py-2 px-4 rounded-md justify-between items-center">
    <section className="flex">
      <h1 className="bg-blue-500 p-4 font-bold rounded-md text-xl text-white">
        <FaFile />
      </h1>
      <section className="ml-4">
        <h1 className="text-gray-600">Corporate Report</h1>
        <h2 className="font-bold text-gray-800">{report.quarter}, {report.year}</h2>
      </section>
    </section>
    <section className="">
        <a href={`${report.fileUrl}`} target='_blank' className="bg-blue-500 hover:bg-blue-600 font-semibold px-2 py-2 rounded-md text-white">Download</a>
    </section>
  </section>
  )
}

export default SingleCorporateReportListClientItem