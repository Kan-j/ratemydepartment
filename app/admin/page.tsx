import SpeedmeterComponent from '@/components/cards/SpeedmeterComponent'
import DepartmentLineChart from '@/components/Graphs/DepartmentLineChart';
import LineChart from '@/components/Graphs/LineChart'
import { getCorporateScoreTrends, getDepartmentRankingDataForGraph, getDetailsForAdminDashboard } from '@/lib/actions';


interface Props {
  searchParams: { [key: string]: string | undefined }
}


const AdminHomePage = async({searchParams}: Props) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentQuarter = Math.ceil((today.getMonth() + 1) / 3); 
  const q = parseInt(searchParams['q'] || '')|| currentQuarter
  const y = parseInt(searchParams['y'] || '')|| currentYear

  const corporateScores = await getCorporateScoreTrends()
  const departmentScoreTrends = await getDepartmentRankingDataForGraph()

  const {
    corporateScore,
    numberOfDepartmentsRated,
    totalRespondents,
    totalResponses,
    totalLikes,
    totalDislikes,
    totalImprovements
  } = await getDetailsForAdminDashboard(q, y)




  return (
    <div className='flex flex-col min-h-screen'>

      {/* Dashboard metrics */}
      <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5'>
          <section className="col-span-4 flex gap-4 w-full">
            <section className="w-full grid grid-cols-3">
            <div className=" flex  flex-col items-center px-4 py-4 text-gray-800">
              <h1 className="text-5xl font-bold">{numberOfDepartmentsRated}</h1>
              <p className="">Departments/ Units</p>
            </div>
            <div className=" flex  flex-col items-center px-4 py-4 text-gray-800">
              <h1 className="text-5xl font-bold">{totalRespondents}</h1>
              <p className="">Respondents</p>
            </div>
            <div className=" flex  flex-col items-center px-4 py-4 text-gray-800">
              <h1 className="text-5xl font-bold">{totalResponses}</h1>
              <p className="">Responses</p>
            </div>
            <div className=" flex  flex-col items-center px-4 py-4 text-gray-800">
              <h1 className="text-5xl font-bold">{totalLikes}</h1>
              <p className="">Likes</p>
            </div>
            <div className=" flex  flex-col items-center px-4 py-4 text-gray-800">
              <h1 className="text-5xl font-bold">{totalDislikes}</h1>
              <p className="">Dislikes</p>
            </div>
            <div className=" flex  flex-col items-center px-4 py-4 text-gray-800">
              <h1 className="text-5xl font-bold">{totalImprovements}</h1>
              <p className="">Improvements</p>
            </div>
            </section>
          </section>
          <section className="col-span-2 w-11/12 h-72 ">
            <h1 className='mb-4 text-gray-800 font-bold '>Corporate Score</h1>
            <SpeedmeterComponent value={corporateScore}/>
          </section>
      </section>

      <section className="w-full mt-4">
        <h1 className="font-bold mb-3 text-gray-700">Corporate Score Trends</h1>
        <section className="w-11/12 h-fit">
          <LineChart data={corporateScores} isCorporate={true}/>
        </section>
      </section>
      
      <section className="w-full mt-10 ">
        <h1 className="font-bold mb-3 text-gray-700">Department Score Trends</h1>
        <section className="w-11/12 h-fit">
        <DepartmentLineChart data={departmentScoreTrends} />
        </section>
      </section>

    </div>
  )
}

export default AdminHomePage