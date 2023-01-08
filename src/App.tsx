import { useState } from 'react'
import AnalysisTool from './pages/analysisTool/AnalysisTool'
import Cooperation from './pages/cooperation/Cooperation'
import "./App.css"

function App() {
  const params = new URLSearchParams(location.search);

  return (
    <div className="App">
      {params.get('pageId')==='AnalysisTool' ? <AnalysisTool/> : <Cooperation/> }
    </div>
  )
}

export default App

