import { useState } from 'react'
import AnalysisTool from './pages/analysisTool/AnalysisTool'
import Cooperation from './pages/cooperation/Cooperation'
import "./App.css"

function App() {
  const params = new URLSearchParams(location.search);
  if(params.get('pageId')==='AnalysisTool'){
    let h3:any = document.getElementsByClassName('title')[0];
    h3.innerText = '분석환경'
  }
  
  return (
    <div className="App">
      {params.get('pageId')==='AnalysisTool' ? <AnalysisTool/> : <Cooperation/> }
    </div>
  )
}

export default App

