import DepartmentPerformanceChart from '@/components/shared/DepartmentPerformanceChart'
import QuarterSelector from '@/components/shared/QuarterSelector'
import React from 'react'


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDepartmentRankingData } from '@/lib/actions'
import { FaChartBar, FaDownload, FaHamburger } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi';

import { getServerSession } from 'next-auth'
import { Button } from '@/components/ui/button'
import DepartmentsPerformanceTable from '@/components/shared/DepartmentsPerformanceTable'
import RankingsDownloadButton from '@/components/forms/RankingsDownloadButton'



interface Props {
  searchParams: { [key: string]: string | undefined }
}


const RankingsPage = async({searchParams}: Props) => {
  const session = await getServerSession()
  const email = session?.user?.email
  
  const response = await fetch(`http://127.0.0.1:3000/api/department?email=${email}`)
  const  userDetails= await response.json()
  
  const {departmentId} = userDetails.user

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentQuarter = Math.ceil((today.getMonth() + 1) / 3); 
  const q = parseInt(searchParams['q'] || '')|| currentQuarter
  const y = parseInt(searchParams['y'] || '')|| currentYear



    const departmentRankings = await getDepartmentRankingData(q, y)  
    


  return (
    <div className='flex flex-col'>
      <section className="flex flex-col gap-4 justify-end mb-6 md:mb-0 md:hidden">
        <section className="flex justify-end">
          <QuarterSelector screen='small'/>
        </section>
      </section>
      
      <section>
        <h1 className="text-gray-600 text-xl font-semibold">Internal Customer Survey Ranking for Quarter {q}, {y}</h1>
      </section>
      <section className='mt-3 rounded-lg px-4 py-2 w-full'>
          <Tabs defaultValue="list" className="w-full">
              <TabsList>
              <TabsTrigger value="list">
                <GiHamburgerMenu fontSize={24} />
              </TabsTrigger>
              <TabsTrigger value="chart">
                <FaChartBar fontSize={24}/>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" >
              <section className="w-3/4 flex justify-end mb-3">
                <RankingsDownloadButton rankingData={JSON.parse(JSON.stringify(departmentRankings))} quarter={q} year={y}/>
              </section>
              {departmentRankings.length<1 ? <p className="">No data found</p>: <DepartmentsPerformanceTable isAdmin={false} departmentAverages={departmentRankings} quarter={q} year={y}/>}
            </TabsContent>
            <TabsContent value="chart">
              {departmentRankings.length<1 ? <p className="">No data found</p>: <DepartmentPerformanceChart departmentAverages={departmentRankings}/>}
            </TabsContent>
          </Tabs>
      </section>
    </div>
  )
}

export default RankingsPage