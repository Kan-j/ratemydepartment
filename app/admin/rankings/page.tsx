import DepartmentPerformanceChart from '@/components/shared/DepartmentPerformanceChart'
import DepartmentsPerformanceTable from '@/components/shared/DepartmentsPerformanceTable'
import QuarterSelector from '@/components/shared/QuarterSelector'
import SmallScreenInput from '@/components/shared/SmallScreenInput'
import DepartmentRankingPublishButton from '@/components/forms/DepartmentRankingPublishButton'


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDepartmentStatistics,getDepartmentRankingIds } from '@/lib/actions'
import { FaChartBar } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi';

interface Props {
  searchParams: { [key: string]: string | undefined }
}


const RankingsPageAdmin = async({searchParams}: Props) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentQuarter = Math.ceil((today.getMonth() + 1) / 3); 
  const q = parseInt(searchParams['q'] || '')|| currentQuarter
  const y = parseInt(searchParams['y'] || '')|| currentYear


  const {
    departmentAverages
  } = await getDepartmentStatistics(q, y)
  // SESSION ADDED

    const departmentRankingIds = await getDepartmentRankingIds(q, y) 
    // SESSION ADDED

  return (
    <div className='flex flex-col'>
      <section className="flex flex-col gap-4 justify-end mb-6 md:mb-0 md:hidden">
        <section className="flex justify-end">
          <QuarterSelector screen='small'/>
        </section>
        <SmallScreenInput/>
      </section>
      
      {/* Dashboard metrics */}
      <section>
        <h1 className="text-gray-600 text-xl font-semibold">Internal Customer Survey Ranking for Quarter {q}, {y}</h1>
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
            {departmentRankingIds &&  <DepartmentRankingPublishButton quarter={q} year={y} departmentRankingIds={departmentRankingIds} />}
           
            </section>
            <TabsContent value="list">
              {departmentAverages.length<1 ? <p className="">No data found</p>: <DepartmentsPerformanceTable isAdmin={true} departmentAverages={departmentAverages} quarter={q} year={y} />}
            </TabsContent>
            <TabsContent value="chart">
              {departmentAverages.length<1 ? <p className="">No data found</p>: <DepartmentPerformanceChart departmentAverages={departmentAverages}/>}
            </TabsContent>
          </Tabs>
      </section>
    </div>
  )
}

export default RankingsPageAdmin