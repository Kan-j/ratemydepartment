import axios from 'axios';
import React from 'react'

const CorporateReportsList = async() => {
    const responses = [
    "Provides reliable data management.",
    "Ensures data security and compliance.",
    "Has streamlined our reporting processes.",
    "Is quick to resolve technical issues.",
    "Supports efficient system integration.",
    "Provides accurate data analytics.",
    "Is always up-to-date with the latest technology.",
    "Maintains system uptime effectively.",
    "Is responsive to user needs.",
    "Delivers insightful business intelligence.",
    "Provides excellent hardware support.",
    "Is an expert in troubleshooting complex issues.",
    "Ensures network stability.",
    "Offers quick and effective solutions.",
    "Is proactive in system maintenance.",
    "Excels at managing IT infrastructure.",
    "Is always available for emergencies.",
    "Provides great technical training.",
    "Is innovative in solving problems.",
    "Ensures seamless software updates.",
    "Delivers innovative ideas.",
    "Aligns company goals with actionable plans.",
    "Has a forward-thinking approach.",
    "Fosters collaboration across departments.",
    "Keeps us ahead of competitors.",
    "Has a clear strategic vision.",
    "Is always prepared for future challenges.",
    "Excels in strategic planning.",
    "Supports long-term growth.",
    "Drives the company's overall direction."
      ]

    const response = await axios.post(
        `http://localhost:3000/api/feedbackAnalyzer`,
        {
          responses:responses
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(response.data)


  return (
    <section>
         <section className=" w-full flex flex-col gap-3 p-3 rounded-lg">
                    <h1>Hi There</h1>
               </section>
    </section>
  )
}

export default CorporateReportsList