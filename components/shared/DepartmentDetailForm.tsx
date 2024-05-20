import RatingDistribution from '../cards/RatingDistribution';
import QuarterSelector from './QuarterSelector';

interface DepartmentDetailsProp {
    department: {
      id: number;
      name: string;
      ratings: { id: number; stars: number; }[];
    };
    totalRatings: number;
    starsCount: { [key: number]: number };
    averageStars: number;
  }



const DepartmentDetail = ({department,totalRatings,starsCount,averageStars}:DepartmentDetailsProp) => {    
    
  return (
    <section className='flex h-full flex-col gap-6 mt-2 md:mt-0 md:gap-0 mx-auto justify-start md:items-start md:flex-row md:justify-around w-full md:pt-10 lg:pt-20'>
        <section className="flex flex-col justify-end  md:hidden">
            <section className="flex justify-end">
              <QuarterSelector screen="small"/>
            </section>
        </section>
        <section className="flex  md:h-full flex-col gap-8  md:gap-0 mx-auto justify-start md:items-start md:flex-row md:justify-around w-full md:pt-10 lg:pt-20">
            <article>
            <section className='flex flex-col items-start'>
            <h1 className="text-2xl md:text-3xl lg:text-5xl text-gray-800 font-semibold md:mb-2">{department.name}</h1>
                <div className="flex flex-row text-gray-900 mb-0 md:mb-1">
                    <h1 className="text-2xl md:text-6xl lg:text-8xl font-bold">{averageStars}</h1>
                </div>
                <h1 className="font-medium md:font-bold text-gray-600 mb-0 md:mb-2 text-base">Overall Quality Based on <span className="underline">
                    {totalRatings} ratings</span></h1>
            </section>
        
            </article>

            <article className='flex flex-col items-start md:block'>
                <RatingDistribution starsCount={starsCount}/>
            </article>
        </section>
        

    </section>
  )
}

export default DepartmentDetail