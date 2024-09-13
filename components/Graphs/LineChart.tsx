"use client"
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

const LineChart = ({ data,isCorporate }:{data: any, isCorporate? :any}) => {
  const [startQuarter, setStartQuarter] = useState('Q1');
  const [startYear, setStartYear] = useState(data[0].year);
  const [endQuarter, setEndQuarter] = useState('Q4');
  const [endYear, setEndYear] = useState(data[data.length - 1].year);

  const filteredData = data.filter(
    (d:any) =>
      (d.year > startYear || (d.year === startYear && quarters.indexOf(d.quarter) >= quarters.indexOf(startQuarter))) &&
      (d.year < endYear || (d.year === endYear && quarters.indexOf(d.quarter) <= quarters.indexOf(endQuarter)))
  );

  const chartData = {
    labels: filteredData.map((d:any) => `${d.quarter} ${d.year}`),
    datasets: [
      {
        label: `${isCorporate ?'Corporate Score Trends' : 'Department Score Trends'}`,
        data: filteredData.map((d:any) => d.value),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: false,
      },
    ],
  };

  return (
    <div >
      <div className='flex justify-between xl:w-8/12 mb-3'>
        <section className="flex gap-8">
                <div className="flex flex-col gap-1">
                <label htmlFor="start-year" className='text-gray-800 text-sm font-medium'>Start Year: </label>
                <input
                id="start-year"
                type="number"
                value={startYear}
                className='bg-white text-gray-800 w-24 border border-gray-500 pl-2 py-1 rounded-lg'
                onChange={(e) => setStartYear(parseInt(e.target.value))}
                />
            </div>
            
            <div className="flex flex-col gap-1">
                <label htmlFor="start-quarter" className='text-gray-800 text-sm font-medium'>Start Quarter: </label>
                <select
                id="start-quarter"
                value={startQuarter}
                onChange={(e) => setStartQuarter(e.target.value)}
                className='bg-white text-gray-800 w-24 border border-gray-500 pl-2 py-1 rounded-lg'
                >
                {quarters.map((q) => (
                    <option key={q} value={q}>
                    {q}
                    </option>
                ))}
                </select>
            </div>
        </section>
        
        <section className="flex gap-8">
            <div className="flex flex-col gap-1">
                <label htmlFor="end-year" className='text-gray-800 text-sm font-medium'>End Year: </label>
                <input
                id="end-year"
                type="number"
                value={endYear}
                onChange={(e) => setEndYear(parseInt(e.target.value))}
                className='bg-white text-gray-800 w-24 border border-gray-500 pl-2 py-1 rounded-lg'
                />
            </div>
            
            <div className="flex flex-col gap-1">
                <label htmlFor="end-quarter" className='text-gray-800 text-sm font-medium'>End Quarter: </label>
                <select id="end-quarter" value={endQuarter} onChange={(e) => setEndQuarter(e.target.value)}
                    className='bg-white text-gray-800 w-24 border border-gray-500 pl-2 py-1 rounded-lg'>
                {quarters.map((q) => (
                    <option key={q} value={q}>
                    {q}
                    </option>
                ))}
                </select>
            </div>
        </section>
        
      </div>
      <Line data={chartData} height={80}/>
    </div>
  );
};

export default LineChart;
