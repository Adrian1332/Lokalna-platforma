import { Link } from 'react-router-dom'
import '../styles/Navbar.scss'

const Navbar = () => {
  return (
    <nav className="main-navbar">
      <h1 className="app-title">Lokalna platforma</h1>
      <div className="nav-links">
        <Link to="/">Oferty</Link>
        <Link to="/mapa">Mapa</Link>
        <Link to="/new">Dodaj ofertę</Link>
      </div>
    </nav>
  )
}

export default Navbar