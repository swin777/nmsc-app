import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./assets/resources/homepage/css/font-awesome.css"
import "./assets/resources/homepage/css/style.css"
import "./assets/resources/homepage/css/mainpage/style.css"
import "./assets/resources/homepage/scss/add.css"
import "./assets/resources/homepage/css/customPagination.css";
import { RecoilRoot } from 'recoil'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
)