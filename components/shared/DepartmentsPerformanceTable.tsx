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

interface departmentAveragesProps {
  departmentAverages: {
    id: number,
    name: string,
    averageRating: number
  }[]
}

const DepartmentsPerformanceTable = ({departmentAverages}: departmentAveragesProps) => {
  return (
    <section className='w-full'>
    <Table className='w-full'>
      <TableCaption>Internal Customer Survey Ranking For Quarter 1 </TableCaption>
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
              <TableCell><Link href={`/admin/departments/${department.id}`}>{department.name}</Link> </TableCell>
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