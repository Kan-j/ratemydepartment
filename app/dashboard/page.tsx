import React from 'react'

import { getServerSession } from 'next-auth'
import SpeedmeterComponent from '@/components/cards/SpeedmeterComponent'
import LineChart from '@/components/Graphs/LineChart'
import { getDepartmentAndCorporateScores, getDepartmentQuarterlyAverages } from '@/lib/actions'
export const dynamic = 'force-dynamic';  // Ensures this page will be rendered on the server


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
    // SESSION ADDED
  // const {likesWordCloudData, dislikesWordCloudData, improvementsWordCloudData} = await generateWordCloudDataForFields(mydepartmentId, y, q);
  const averageScoreTrends = await getDepartmentQuarterlyAverages(mydepartmentId)
   // SESSION ADDED


  return (
    <div className='flex flex-col min-h-screen'>

      {/* Dashboard metrics */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6'>
          <section className="col-span-2 w-full">
            <h1 className="font-semibold mb-3 text-gray-700">Welcome to RateADepartment ,</h1>
            <p className="text-gray-700"></p>
            <section className='flex flex-col text-gray-800 justify-start items-start mt-2 w-full gap-2'>
              <p>View departmental & Corporate reports at <b>Reports</b> </p>
              <p>View Quarterly Rankings at <b>Ranking</b> </p>
              <p>View your department's reviews at <b>My Department</b> </p>
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


      <section className="w-full mt-4 mb-6">
        <h1 className="font-bold mb-3 text-gray-700">{departmentName}'s Score Trends</h1>
        <section className="w-11/12 h-fit">
          <LineChart data={averageScoreTrends} />
        </section>
      </section>


     
    </div>
  )
}

export default DashboardHomePage