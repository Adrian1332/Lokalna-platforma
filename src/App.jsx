import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import OfferList from './components/OfferList'
import Navbar from './components/Navbar'
import MapPage from './pages/MapPage'
import AddEditOffer from './pages/AddEditOffer'
import { sampleOffers } from './data/sampleOffers'

function App() {
  const [offers, setOffers] = useState(sampleOffers)

  const deleteOffer = (id) => {
    setOffers(prev => prev.filter(o => o.id !== id))
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<OfferList offers={offers} deleteOffer={deleteOffer} />} />
        <Route path="/mapa" element={<MapPage offers={offers} />} />
        <Route path="/edit/:id" element={<AddEditOffer offers={offers} setOffers={setOffers} />} />
        <Route path="/new" element={<AddEditOffer offers={offers} setOffers={setOffers} />} />
      </Routes>
    </>
  )
}

export default App