import PerformanceCard from '@/components/cards/PerformanceCard'
import DepartmentPerformanceChart from '@/components/shared/DepartmentPerformanceChart'
import DepartmentsPerformanceTable from '@/components/shared/DepartmentsPerformanceTable'
import QuarterSelector from '@/components/shared/QuarterSelector'
import SmallScreenInput from '@/components/shared/SmallScreenInput'



import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDepartmentStatistics } from '@/lib/actions'
import Image from 'next/image'


interface Props {
  searchParams: { [key: string]: string | undefined }
}


const AdminHomePage = async({searchParams}: Props) => {
  const q = parseInt(searchParams['q'] || '')
  const y = parseInt(searchParams['y'] || '')

  const {
    totalDepartments,
    totalRatings,
    highestRating,
    lowestRating,
    departmentAverages} = await getDepartmentStatistics(q, y)


  return (
    <div className='flex flex-col'>
      <section className="flex flex-col gap-4 justify-end mb-6 md:mb-0 md:hidden">
        <section className="flex justify-end">
          <QuarterSelector screen='small'/>
        </section>
        <SmallScreenInput/>
      </section>
      
      {/* Dashboard metrics */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <PerformanceCard title='Total Departments Rated' value={totalDepartments} key={1}/>
          <PerformanceCard title='Total Feedback Count' value={totalRatings} key={2}/>
          <PerformanceCard title='Highest Rating' value={highestRating} key={3}/>
          <PerformanceCard title='Lowest Rating' value={lowestRating} key={4}/>
      </section>
      <section className='mt-3 bg-blue-100 rounded-lg px-4 py-2 w-full'>
          <Tabs defaultValue="account" className="w-full">
            <TabsList>
              <TabsTrigger value="list">
                <Image src="/assets/options.svg" alt="alt" width={24} height={24}  />
              </TabsTrigger>
              <TabsTrigger value="chart">
                <Image src="/assets/chart.svg" alt="alt" width={24} height={24}  />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              {departmentAverages.length<1 ? <p className="">No data found</p>: <DepartmentsPerformanceTable departmentAverages={departmentAverages} quarter={q} year={y}/>}
            </TabsContent>
            <TabsContent value="chart">
              {departmentAverages.length<1 ? <p className="">No data found</p>: <DepartmentPerformanceChart departmentAverages={departmentAverages}/>}
            </TabsContent>
          </Tabs>
      </section>
    </div>
  )
}

export default AdminHomePage