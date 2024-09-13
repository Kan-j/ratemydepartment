"use client"
import { getPaginatedCorporateReportsForClient } from '@/lib/actions'
import React, { useEffect, useState } from 'react'
import SingleCorporateReportListClientItem from './SingleCorporateReportListClientItem';
import CorporateReportListClientPagination from './CorporateReportListClientPagination';

const CorporateReportListClient = ({page}:{page:number}) => {
    const [reports, setReports] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [NextPageExists, setNextPageExists] = useState<boolean>(false);
    const [PrevPageExists, setPrevPageExists] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(page);
  
  
    useEffect(() => {
      const fetchReports = async () => {
        const data = await getPaginatedCorporateReportsForClient(currentPage);
         // SESSION ADDED
        setReports(data.reports);
        setTotalPages(data.totalPages);
        setNextPageExists(data.NextPageExists);
        setPrevPageExists(data.PrevPageExists);
      };
  
      fetchReports();
    }, [currentPage]);
  

  return (
    <section className="w-full flex flex-col gap-3 p-3 rounded-lg">
      {reports.length > 0 ? (
        reports.map(report => (
          <SingleCorporateReportListClientItem 
          key={report.id}
          report={report}
        />
        ))
      ) : (
        <p>No reports available.</p>
      )}
      
      {/* Pagination controls can be added here */}
        <section className="w-full ">
            <section className="w-3/4 justify-center items-center mt-2 mb-6">
            <CorporateReportListClientPagination NextPageExists={NextPageExists} PrevPageExists={PrevPageExists} totalPages={totalPages} currentPage={currentPage}/>
            </section>
      </section>
      
    </section>
  )
}

export default CorporateReportListClient