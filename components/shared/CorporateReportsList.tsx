"use client"
import React, { useState, useEffect } from 'react';
import SingleCorporateReportListItem from '../Admin/SingleCorporateReportListItem';
import { getPaginatedCorporateReports, togglePublished } from '@/lib/actions';
import CorporateReportPagination from './CorporateReportPagination';

const CorporateReportsList = ({page}:{page:number}) => {
  const [reports, setReports] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [NextPageExists, setNextPageExists] = useState<boolean>(false);
  const [PrevPageExists, setPrevPageExists] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(page);


  useEffect(() => {
    const fetchReports = async () => {
      const data = await getPaginatedCorporateReports(currentPage);
      setReports(data.reports);
      setTotalPages(data.totalPages);
      setNextPageExists(data.NextPageExists);
      setPrevPageExists(data.PrevPageExists);
    };

    fetchReports();
  }, [currentPage]);


  const handleTogglePublish = async (reportId: number) => {
    try {
      await togglePublished(reportId);
      // Refetch reports after toggling status
      const data = await getPaginatedCorporateReports(currentPage);
      setReports(data.reports);
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };
  return (
    <section className="w-full flex flex-col gap-3 p-3 rounded-lg">
      {reports.length > 0 ? (
        reports.map(report => (
          <SingleCorporateReportListItem
          key={report.id}
          report={report}
          onTogglePublish={handleTogglePublish} // Pass handler to child component
        />
        ))
      ) : (
        <p>No reports available.</p>
      )}
      
      {/* Pagination controls can be added here */}
      <CorporateReportPagination NextPageExists={NextPageExists} PrevPageExists={PrevPageExists} totalPages={totalPages} currentPage={currentPage}/>
    </section>
  );
}

export default CorporateReportsList