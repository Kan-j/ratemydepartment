import SpeedmeterComponent from '@/components/cards/SpeedmeterComponent'
import WordCloudComponent from '@/components/cards/WordCloudComponent';
import DepartmentLineChart from '@/components/Graphs/DepartmentLineChart';
import LineChart from '@/components/Graphs/LineChart'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

interface Props {
  searchParams: { [key: string]: string | undefined }
}


const AdminHomePage = async({searchParams}: Props) => {
  const data = [
    { quarter: 'Q1', year: 2023, value: 4.3 },
    { quarter: 'Q2', year: 2023, value: 3.5 },
    { quarter: 'Q3', year: 2023, value: 3.8 },
    { quarter: 'Q4', year: 2023, value: 4.8 },
    { quarter: 'Q1', year: 2024, value: 4.5 },
    { quarter: 'Q2', year: 2024, value: 4.9 },
    { quarter: 'Q3', year: 2024, value: 4.2 },
    { quarter: 'Q4', year: 2025, value: 4.1 },
    { quarter: 'Q1', year: 2025, value: 4.6 },
    { quarter: 'Q2', year: 2025, value: 4.8 },
    // more data points...
  ];

  const DepartmentData = [
    { department: 'HR', quarter: 'Q1', year: 2023, value: 4.3 },
    { department: 'HR', quarter: 'Q2', year: 2023, value: 4.5 },
    { department: 'HR', quarter: 'Q3', year: 2023, value: 3.6 },
    { department: 'Finance', quarter: 'Q1', year: 2023, value: 2.5 },
    { department: 'Finance', quarter: 'Q2', year: 2023, value: 4.8 },
    { department: 'IT', quarter: 'Q1', year: 2023, value: 3.8 },
    { department: 'IT', quarter: 'Q2', year: 2023, value: 4.2 },
    // more data points...
  ];

  
const auditData = [
  {
    FullName: "Gilbert Kwateng Kusi",
    Email: "gilbert.kusi@vra.com",
    Action: "Rating Department",
    Timeline: "7:45am, 17th June, 2024",
    Description: "Gilbert Kusi rated Technical Services",
  },
  
  {
    FullName: "Gilbert Kwateng Kusi",
    Email: "gilbert.kusi@vra.com",
    Action: "Rating Department",
    Timeline: "7:45am, 17th June, 2024",
    Description: "Gilbert Kusi rated Technical Services",
  },
  
  {
    FullName: "Gilbert Kwateng Kusi",
    Email: "gilbert.kusi@vra.com",
    Action: "Rating Department",
    Timeline: "7:45am, 17th June, 2024",
    Description: "Gilbert Kusi rated Technical Services",
  },
  
  {
    FullName: "Gilbert Kwateng Kusi",
    Email: "gilbert.kusi@vra.com",
    Action: "Rating Department",
    Timeline: "7:45am, 17th June, 2024",
    Description: "Gilbert Kusi rated Technical Services",
  },
]

  return (
    <div className='flex flex-col min-h-screen'>

      {/* Dashboard metrics */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5'>
          <section className="col-span-4 flex gap-4 w-full">
            <section className="w-full grid grid-cols-3">
            <div className=" flex  flex-col items-center px-4 py-4 text-gray-800">
              <h1 className="text-5xl font-bold">24</h1>
              <p className="">Departments/ Units</p>
            </div>
            <div className=" flex  flex-col items-center px-4 py-4 text-gray-800">
              <h1 className="text-5xl font-bold">535</h1>
              <p className="">Respondents</p>
            </div>
            <div className=" flex  flex-col items-center px-4 py-4 text-gray-800">
              <h1 className="text-5xl font-bold">600</h1>
              <p className="">Responses</p>
            </div>
            <div className=" flex  flex-col items-center px-4 py-4 text-gray-800">
              <h1 className="text-5xl font-bold">52%</h1>
              <p className="">Positive Responses</p>
            </div>
            <div className=" flex  flex-col items-center px-4 py-4 text-gray-800">
              <h1 className="text-5xl font-bold">42%</h1>
              <p className="">Negative Responses</p>
            </div>
            <div className=" flex  flex-col items-center px-4 py-4 text-gray-800">
              <h1 className="text-5xl font-bold">8%</h1>
              <p className="">Neutral Responses</p>
            </div>
            </section>
          </section>
          <section className="col-span-2 w-11/12 h-72 ">
            <h1 className='mb-4 text-gray-800 font-bold '>Corporate Score</h1>
            <SpeedmeterComponent value={4.3}/>
          </section>
      </section>

      <section className="w-full mt-4">
        <h1 className="font-bold mb-3 text-gray-700">Corporate Score Trends</h1>
        <section className="w-11/12 h-fit">
          <LineChart data={data} />
        </section>
      </section>
      
      <section className="w-full mt-10 ">
        <h1 className="font-bold mb-3 text-gray-700">Department Score Trends</h1>
        <section className="w-11/12 h-fit">
        <DepartmentLineChart data={DepartmentData} />
        </section>
      </section>



     
    </div>
  )
}

export default AdminHomePage