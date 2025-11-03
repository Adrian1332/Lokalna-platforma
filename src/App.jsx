import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import OfferList from './components/OfferList'
import Navbar from './components/Navbar'
import MapPage from './pages/MapPage'
import AddEditOffer from './pages/AddEditOffer'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider, useAuth } from './context/AuthContext'
import { fetchOffers, removeOffer } from './services/offersService'

// Mała pomocnicza warstwa, żeby mieć dostęp do user.uid w deleteOffer
function AppInner() {
  const [offers, setOffers] = useState([])
  const location = useLocation()
  const { user } = useAuth()

  // wczytaj oferty z Firestore przy starcie
  useEffect(() => {
    const load = async () => {
      const data = await fetchOffers()
      setOffers(data)
    }
    load()
  }, [])

  const deleteOffer = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć tę ofertę?')) return

    // removeOffer wymaga teraz currentUserUid żeby sprawdzić właściciela
    if (!user) {
      alert('Musisz być zalogowany.')
      return
    }

    try {
      await removeOffer(id, user.uid)
      setOffers(prev => prev.filter(o => o.id !== id))
    } catch (err) {
      console.error('Błąd usuwania:', err)
      alert('Nie masz uprawnień do usunięcia tej oferty.')
    }
  }

  return (
    <>
      <Navbar />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* nowa strona główna */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* lista ofert przeniesiona na /offers */}
          <Route
            path="/offers"
            element={
              <OfferList
                offers={offers}
                deleteOffer={deleteOffer}
                setOffers={setOffers}
              />
            }
          />

          {/* mapa (u Ciebie była /mapa, zachowujemy) */}
          <Route
            path="/mapa"
            element={<MapPage offers={offers} />}
          />

          {/* edycja istniejącej oferty - tylko zalogowany */}
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <AddEditOffer
                  offers={offers}
                  setOffers={setOffers}
                />
              </PrivateRoute>
            }
          />

          {/* dodawanie nowej oferty - tylko zalogowany */}
          <Route
            path="/new"
            element={
              <PrivateRoute>
                <AddEditOffer
                  offers={offers}
                  setOffers={setOffers}
                />
              </PrivateRoute>
            }
          />

          {/* auth */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />
        </Routes>
      </AnimatePresence>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

export default App
