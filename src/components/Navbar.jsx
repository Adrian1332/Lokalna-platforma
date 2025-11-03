import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Navbar.scss'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar-wrapper">
      <div className="navbar-inner">
        {/* lewo */}
        <div className="nav-left">
          <Link to="/" className="brand">
            Lokalna platforma
          </Link>
        </div>

        {/* środek */}
        <div className="nav-links">
          <Link to="/offers">Oferty</Link>
          <Link to="/mapa">Mapa</Link>
          <Link to="/new">Dodaj ofertę</Link>
        </div>

        {/* prawo */}
        <div className="nav-auth">
          {user ? (
            <button className="logout-btn" onClick={logout}>
              Wyloguj ({user.email})
            </button>
          ) : (
            <>
              <Link to="/login">Zaloguj</Link>
              <span className="sep">/</span>
              <Link to="/register">Rejestracja</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
