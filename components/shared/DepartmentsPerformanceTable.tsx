"use client"

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FaDownload } from 'react-icons/fa';
import {useCSVDownloader} from 'react-papaparse';
interface departmentAveragesProps {
  departmentAverages: {
    id: number,
    name: string,
    averageRating: number
  }[],
  year:number,
  quarter: number,
  isAdmin: boolean,
  ratingsForTheYear?: any,
  ratingForTheQuarter?: any
}

const DepartmentsPerformanceTable = ({departmentAverages, quarter, year,isAdmin, ratingsForTheYear, ratingForTheQuarter}: departmentAveragesProps) => {
  const {CSVDownloader, Type} = useCSVDownloader()
  const rankedDepartments = departmentAverages.map((department, index) => {
    return {
        ranking: index + 1,
        name: department.name,
        averageRating: department.averageRating
    };
  });
  return (
    <section className='w-full'>
    <Table className='w-full'>
      {isAdmin && <TableCaption>
        <section className="w-full flex gap-2 justify-end">
          <CSVDownloader
                type={Type.Button}
                filename={'DepartmentRanking_Q'+quarter + '_'+ year}
                bom={true}
                className="bg-blue-500 text-slate-50 hover:bg-blue-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 px-3 rounded-md"
                data={rankedDepartments}
              >
            Download List
              </CSVDownloader>
          <CSVDownloader
                type={Type.Button}
                filename={'DepartmentRatings' + '_'+ year}
                bom={true}
                className="bg-blue-500 text-slate-50 hover:bg-blue-900/90 dark:bg-slate-50 py-2 dark:text-slate-900 dark:hover:bg-slate-50/90 px-3 rounded-md"
                data={ratingsForTheYear}
              >
            Download Quarter's Ratings
              </CSVDownloader>
          <CSVDownloader
                type={Type.Button}
                filename={'DepartmentRatings' + '_'+ year}
                bom={true}
                className="bg-blue-500 text-slate-50 hover:bg-blue-900/90 dark:bg-slate-50 py-2 dark:text-slate-900 dark:hover:bg-slate-50/90 px-3 rounded-md"
                data={ratingsForTheYear}
              >
            Download Year's rating
              </CSVDownloader>
        </section>
        
    
    </TableCaption>}
      
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3 text-gray-900">Ranking</TableHead>
          <TableHead className='text-gray-900'>Department</TableHead>
          <TableHead className='text-gray-900'>Overall Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className='text-gray-800'>
        {departmentAverages.map((department,index)=>{
          return (
            <TableRow key={index}>
              <TableCell className="font-medium">#{index+1}</TableCell>
              <TableCell>{isAdmin? <Link href={`/admin/departments/${department.id}`}>{department.name}</Link>: department.name} </TableCell>
              <TableCell className="">{department.averageRating}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  </section>
  )
}

export default DepartmentsPerformanceTable