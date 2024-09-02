"use client"
import React from 'react'
import ReactWordcloud from 'react-wordcloud';

const WordCloudComponent = ({words}:any) => {
  return (
    <ReactWordcloud words={words}  options={{
        fontSizes: [25,60],
        rotations: 3,
        
    }}  />
  )
}

export default WordCloudComponent