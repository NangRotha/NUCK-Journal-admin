import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // 🟢 សាកល្បងយក <React.StrictMode> ចេញម្តង បើនៅតែ Refresh នោះបញ្ហាមិនមែនមកពីនេះទេ ប៉ុន្តែជាការកំណត់ល្អបំផុត
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)