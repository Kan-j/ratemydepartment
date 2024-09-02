import React from 'react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';

interface ReportPaginationProps {
    NextPageExists: boolean;
    PrevPageExists: boolean;
    totalPages: number;
    currentPage: number;
  }

const DepartmentListForReportsAdminPagination: React.FC<ReportPaginationProps> = ({
  NextPageExists,
  PrevPageExists,
  totalPages,
  currentPage,
}) => {
    const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
    const getPageHref = (page: number) => `?departments_list=${page}`;
  
    return (
      <section className="mt-6 mx-auto w-10/12 mb-8 text-gray-800">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={PrevPageExists ? getPageHref(currentPage - 1) : '#'}
                isActive={PrevPageExists}
              />
            </PaginationItem>
            {pagesArray.map((pageIndex) => (
              <PaginationItem key={pageIndex}>
                <PaginationLink href={getPageHref(pageIndex)} isActive={pageIndex === currentPage}>
                  {pageIndex}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={NextPageExists ? getPageHref(currentPage + 1) : '#'}
                isActive={NextPageExists}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
  )
}

export default DepartmentListForReportsAdminPagination