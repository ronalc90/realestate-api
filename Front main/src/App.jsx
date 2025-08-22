import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from "./components/navBar/NavBar"
import { Footer } from "./components/Footer/Footer"
import { PropertiesList } from "./pages/PropertiesList/PropertiesList"
import { PropertyDetail } from "./pages/PropertyDetail/PropertyDetail"
import { NotFound } from "./pages/NotFound/NotFound"

function App() {

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/properties" element={<PropertiesList />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
