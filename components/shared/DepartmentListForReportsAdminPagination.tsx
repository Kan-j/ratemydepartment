"use client"
import React from 'react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
  const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Function to create a query string with the updated page number
    const createQueryString = React.useCallback(
      (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('departments_list', String(page));
        return params.toString();
      },
      [searchParams]
    );

    const handlePageChange = (page: number) => {
      const newQueryString = createQueryString(page);
      router.push(`${pathname}?${newQueryString}`);
    };

    const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

  
    return (
      <section className="mt-6 mx-auto w-10/12 mb-8 text-gray-800">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
              className='cursor-pointer'
              onClick={() => PrevPageExists && handlePageChange(currentPage - 1)}
              isActive={PrevPageExists}
            />
            </PaginationItem>
            {pagesArray.map((pageIndex) => (
              <PaginationItem key={pageIndex} className='cursor-pointer'>
                <PaginationLink
                  onClick={() => handlePageChange(pageIndex)}
                  isActive={pageIndex === currentPage}
                >
                  {pageIndex}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
            <PaginationNext
            className='cursor-pointer'
              onClick={() => NextPageExists && handlePageChange(currentPage + 1)}
              isActive={NextPageExists}
            />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
  )
}

export default DepartmentListForReportsAdminPagination