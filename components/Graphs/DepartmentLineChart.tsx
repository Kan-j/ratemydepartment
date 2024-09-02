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

const DepartmentLineChart = ({ data }:any) => {
  const departments = Array.from(new Set(data.map((d: any) => d.department)));
  console.log(data)
  
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const [startQuarter, setStartQuarter] = useState('Q1');
  const [startYear, setStartYear] = useState(data[0].year);
  const [endQuarter, setEndQuarter] = useState('Q4');
  const [endYear, setEndYear] = useState(data[data.length - 1].year);

  const filteredData = data.filter(
    (d:any) =>
      d.department === selectedDepartment &&
      (d.year > startYear || (d.year === startYear && quarters.indexOf(d.quarter) >= quarters.indexOf(startQuarter))) &&
      (d.year < endYear || (d.year === endYear && quarters.indexOf(d.quarter) <= quarters.indexOf(endQuarter)))
  );

  const chartData = {
    labels: filteredData.map((d:any) => `${d.quarter} ${d.year}`),
    datasets: [
      {
        label: 'Data',
        data: filteredData.map((d:any) => d.value),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <div className='flex xl:w-10/12 justify-between'>
        <section className="flex gap-8">
           <div className="flex flex-col gap-1">
            <label htmlFor="department" className='text-gray-800 text-sm font-medium'>Department: </label>
            <select
              id="department"
              value={selectedDepartment as string}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className='bg-white text-gray-800 border border-gray-500 pl-2 py-1 rounded-lg'
            >
              {departments.map((dept:any) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
    
          <div className="flex flex-col gap-1">
            <label htmlFor="start-year" className='text-gray-800 text-sm font-medium'>Start Year: </label>
            <input
              id="start-year"
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(parseInt(e.target.value))}
              className='bg-white text-gray-800 w-24 border border-gray-500 pl-2 py-1 rounded-lg'
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

export default DepartmentLineChart;
