"use client"
import React from 'react'
import {useCSVDownloader} from 'react-papaparse';

const DownloadOption = ({data, title, fileName}: any) => {
  const {CSVDownloader, Type} = useCSVDownloader();


  return (
    <CSVDownloader
      type={Type.Button}
      filename={fileName}
      bom={true}
      className="text-gray-700 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 px-3"
      data={data}
    >
      <span className='text-left'>{title}</span>
    </CSVDownloader>
  );
}

export default DownloadOption;
