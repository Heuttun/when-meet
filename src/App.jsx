import { Routes, Route } from 'react-router-dom'
import CreatePage from './pages/CreatePage'
import MeetingPage from './pages/MeetingPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreatePage />} />
      <Route path="/m/:id" element={<MeetingPage />} />
    </Routes>
  )
}

export default App
