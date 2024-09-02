import React from 'react'

import { getServerSession } from 'next-auth'
import { Button } from '@/components/ui/button'
import SpeedmeterComponent from '@/components/cards/SpeedmeterComponent'
import WordCloudComponent from '@/components/cards/WordCloudComponent'
import Link from 'next/link'
import LineChart from '@/components/Graphs/LineChart'
import { generateWordCloudDataForFields, getDepartmentAndCorporateScores, getDepartmentQuarterlyAverages } from '@/lib/actions'


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
];


interface Props {
  searchParams: { [key: string]: string | undefined }
}

async function getUserDepartment(){
  const session = await getServerSession()
  const email = session?.user?.email
  const response = await fetch(`http://127.0.0.1:3000/api/department?email=${email}`)
  const  userDetails= await response.json()
  const {departmentId: mydepartmentId} = userDetails.user
  return mydepartmentId;
}



const DashboardHomePage = async({searchParams}: Props) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentQuarter = Math.ceil((today.getMonth() + 1) / 3); 
  const q = parseInt(searchParams['q'] || '')|| currentQuarter
  const y = parseInt(searchParams['y'] || '')|| currentYear
  const mydepartmentId = await getUserDepartment();

  const {
    corporateScore,
    departmentScore,
    departmentName} = await getDepartmentAndCorporateScores(y,q, mydepartmentId)
  const {likesWordCloudData, dislikesWordCloudData, improvementsWordCloudData} = await generateWordCloudDataForFields(mydepartmentId, y, q);
  const averageScoreTrends = await getDepartmentQuarterlyAverages(mydepartmentId)


  return (
    <div className='flex flex-col min-h-screen'>

      {/* Dashboard metrics */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6'>
          <section className="col-span-2 w-full">
            <h1 className="font-semibold mb-3 text-gray-700">Welcome Rachel,</h1>
            <p className="text-gray-700">Here are some recent reports for your department</p>
            <section className='flex flex-col justify-start items-start mt-2 w-full gap-2'>
              <Button variant={'outline'} className='text-gray-500 w-4/6'>Q1, 2024 Report</Button>
              <Button variant={'outline'} className='text-gray-500 w-4/6'>Q1, 2024 Report</Button>
              <Button variant={'outline'} className='text-gray-500 w-4/6'>Q1, 2024 Report</Button>
            </section>
            
            {/* <WordCloudComponent/> */}
          </section>
          <section className="col-span-2 w-11/12 h-72 ">
            <h1 className='mb-4 text-gray-800 font-bold '>Department's Score</h1>
            <SpeedmeterComponent value={departmentScore}/>
          </section>
          <section className="col-span-2 w-11/12 h-72 ">
            <h1 className='mb-4 text-gray-800 font-bold '>Corporate Score</h1>
            <SpeedmeterComponent value={corporateScore}/>
          </section>
      </section>


      <section className="w-full mt-4">
        <h1 className="font-bold mb-3 text-gray-700">{departmentName}'s Score Trends</h1>
        <section className="w-11/12 h-fit">
          <LineChart data={averageScoreTrends} />
        </section>
      </section>


      <section className="grid grid-cols-6 mb-4 mt-9">
          {/* Second Row */}
          <section className="w-full col-span-3">
                <h1 className="font-bold mb-3 text-gray-700">Some Likes about your Department</h1>
                <section className="h-48 w-5/6">
                  <WordCloudComponent words={likesWordCloudData}/>
                </section>
                
          </section>
          <section className="col-span-3 w-full">
                <h1 className="font-bold mb-3 text-gray-700">Some Dislikes about your Department</h1>
                <section className="h-48 w-5/6">
                  <WordCloudComponent words={dislikesWordCloudData}/>
                </section>
          </section>
      </section>

      <section className="w-full mt-4 mb-4">
        <h1 className="font-bold mb-3 text-gray-700">Some Improvement suggestions for your Department</h1>
        <section className="w-11/12 h-52">
          <WordCloudComponent  words={improvementsWordCloudData}/>
        </section>
      </section>
    </div>
  )
}

export default DashboardHomePage