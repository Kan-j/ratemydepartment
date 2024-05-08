"use client"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  import chroma from "chroma-js";

  
  interface departmentAveragesProps {
    departmentAverages: {
      id: number,
      name: string,
      averageRating: number
    }[]
  }

const DepartmentPerformanceChart = ({departmentAverages}: departmentAveragesProps) => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend
    );
    
    const options = {
      indexAxis: 'y' as const,
      elements: {
        bar: {
          borderWidth: 1,
          borderRadius: 1
        },
      },
      plugins: {
        legend: {
          position: 'right' as const,
        },
        title: {
          display: true,
          text: 'Internal Customer Survey Ranking',
        },
      },
  
      responsive: true, // Enable responsiveness
      maintainAspectRatio: false, // Prevent unwanted aspect ratio changes
    };
    
    // const labels = ['Corporate Strategy', 'Commercial Service', 'MIS', 'VHSL', 'Finance', 'Procurement', 'HR',];
    const labels = departmentAverages.map((department)=>{
      return department.name
    })

    const departmentData = departmentAverages.map((department)=>{
      return department.averageRating
    })

    // Define the desired color range
    const startColor = '#008000'; // Green
    const endColor = '#FF0000';  // Red
    
    const colorScale = chroma.scale([startColor, endColor]).colors(departmentData.length);

    const data = {
      labels,
      datasets: [
        {
          label: 'Rating',
          data: departmentData,
          backgroundColor: colorScale,
        },
      ],
    };
  
  
  return (
    <section className='w-full'>
        <Bar options={options} data={data}  className='w-full'/>
    </section>
    
  )
}

export default DepartmentPerformanceChart