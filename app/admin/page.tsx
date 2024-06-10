import PerformanceCard from '@/components/cards/PerformanceCard'
import DepartmentPerformanceChart from '@/components/shared/DepartmentPerformanceChart'
import DepartmentsPerformanceTable from '@/components/shared/DepartmentsPerformanceTable'
import QuarterSelector from '@/components/shared/QuarterSelector'
import SmallScreenInput from '@/components/shared/SmallScreenInput'
import DepartmentRankingPublishButton from '@/components/forms/DepartmentRankingPublishButton'


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDepartmentStatistics,getDepartmentRankingIds, getRatingsForYear, getRatingsForTheQuarterAndYear } from '@/lib/actions'
import Image from 'next/image'
import { FaChartBar, FaHamburger } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi';

interface Props {
  searchParams: { [key: string]: string | undefined }
}


const AdminHomePage = async({searchParams}: Props) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentQuarter = Math.ceil((today.getMonth() + 1) / 3); 
  const q = parseInt(searchParams['q'] || '')|| currentQuarter
  const y = parseInt(searchParams['y'] || '')|| currentYear


  const {
    totalDepartments,
    // totalRatings,
    overallAverageRating,
    highestRating,
    lowestRating,
    departmentAverages} = await getDepartmentStatistics(q, y)

    const departmentRankingIds = await getDepartmentRankingIds(q, y) 

    const ratingsForTheYear = await getRatingsForYear(y || currentYear)

    const ratingsForTheQuarterAndYear = await getRatingsForTheQuarterAndYear(q || currentQuarter,y || currentYear)


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
          <PerformanceCard title='Overall Corporate Score' value={overallAverageRating} key={1}/>
          <PerformanceCard title='Total Departments Rated' value={totalDepartments} key={5}/>
          <PerformanceCard title='Highest Rating' value={highestRating} key={3}/>
          <PerformanceCard title='Lowest Rating' value={lowestRating} key={4}/>
      </section>
      <section className='mt-3 rounded-lg px-4 py-2 w-full'>
          <Tabs defaultValue="list" className="w-full">
          <section className="flex justify-between">
              <TabsList>
              <TabsTrigger value="list">
                <GiHamburgerMenu fontSize={24} />
              </TabsTrigger>
              <TabsTrigger value="chart">
                <FaChartBar fontSize={24}/>
              </TabsTrigger>
            </TabsList>
            {departmentRankingIds &&  <DepartmentRankingPublishButton departmentRankingIds={departmentRankingIds} />}
           
            </section>
            <TabsContent value="list">
              {departmentAverages.length<1 ? <p className="">No data found</p>: <DepartmentsPerformanceTable isAdmin={true} departmentAverages={departmentAverages} quarter={q} year={y} ratingsForTheYear={ratingsForTheYear} ratingForTheQuarter={ratingsForTheQuarterAndYear}/>}
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