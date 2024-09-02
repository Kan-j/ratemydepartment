"use client"
import React from 'react';
import ReactWordcloud from 'react-wordcloud';

interface WordCloudComponentProps {
  words: { text: string; value: number }[];
}

const WordCloudForReport: React.FC<WordCloudComponentProps> = ({ words }) => {
    
  return (
    <div id="wordcloud-container" className='hidden'>
      <ReactWordcloud
        words={words}
        options={{
          fontSizes: [25, 60],
          rotations: 3,
        }}
      />
    </div>
  );
};

export default WordCloudForReport;