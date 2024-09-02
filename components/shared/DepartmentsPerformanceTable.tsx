"use client"
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


interface departmentAveragesProps {
  departmentAverages: {
    id: number,
    name: string,
    averageRating: number
  }[],
  year:number,
  quarter: number,
  isAdmin: boolean,
}

const DepartmentsPerformanceTable = ({departmentAverages,isAdmin}: departmentAveragesProps) => {

  return (
    <section className='w-full'>
    <Table className='w-full'>
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
              <TableCell className="">{department.averageRating.toFixed(2)}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  </section>
  )
}

export default DepartmentsPerformanceTable