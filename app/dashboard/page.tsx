import PerformanceCard from '@/components/cards/PerformanceCard'
import DepartmentPerformanceChart from '@/components/shared/DepartmentPerformanceChart'
import QuarterSelector from '@/components/shared/QuarterSelector'
import SmallScreenInput from '@/components/shared/SmallScreenInput'
import React from 'react'


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDepartmentRankingData } from '@/lib/actions'
import Image from 'next/image'
import { FaChartBar, FaHamburger } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi';
import DepartmentsPerformanceTable from '../../components/shared/DepartmentsPerformanceTable';
import { getServerSession } from 'next-auth'



interface Props {
  searchParams: { [key: string]: string | undefined }
}


const DashboardHomePage = async({searchParams}: Props) => {
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



    const {
      corporateScore,
      highestAverageRating,
      lowestAverageRating,
      departmentAverageRating,
      departmentRankings
    } = await getDepartmentRankingData(q, y, departmentId)  
    
  

  return (
    <div className='flex flex-col'>
      <section className="flex flex-col gap-4 justify-end mb-6 md:mb-0 md:hidden">
        <section className="flex justify-end">
          <QuarterSelector screen='small'/>
        </section>
      </section>
      
      {/* Dashboard metrics */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <PerformanceCard title='Overall Corporate Score' value={corporateScore} key={1}/>
          <PerformanceCard title="Your Department's Score" value={departmentAverageRating} key={5}/>
          <PerformanceCard title='Highest Rating' value={highestAverageRating} key={3}/>
          <PerformanceCard title='Lowest Rating' value={lowestAverageRating} key={4}/>
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

            <TabsContent value="list">
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

export default DashboardHomePage