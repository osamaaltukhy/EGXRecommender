import React from 'react'
import ReactDOM from 'react-dom/client'
import EGXRecommender from './EGXRecommender.jsx'
import './index.css' // We will add basic styling rules here next

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EGXRecommender />
  </React.StrictMode>,
)