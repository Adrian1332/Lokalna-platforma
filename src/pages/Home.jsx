import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Home.scss'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="home-wrapper">
      {/* HERO */}
      <section className="hero-card">
        <div className="hero-left">
          <h1 className="hero-title">
            Lokalna platforma wymiany rzeczy i usług
          </h1>

          <p className="hero-text">
            Sprzedaj, oddaj, pożycz, pomóż sąsiadowi. Wszystko w Twojej okolicy.
          </p>

          <div className="hero-cta-row">
            <Link to="/offers" className="btn-primary">
              Przeglądaj oferty
            </Link>

            {user ? (
              <Link to="/new" className="btn-secondary">
                Dodaj ofertę
              </Link>
            ) : (
              <Link to="/login" className="btn-secondary">
                Zaloguj się
              </Link>
            )}
          </div>

          {user && (
            <p className="hero-user-hint">
              Jesteś zalogowany jako <strong>{user.email}</strong>
            </p>
          )}
        </div>

        <div className="hero-right">
          <div className="stat-card">
            <div className="stat-number">✔</div>
            <div className="stat-text">
              Bezpiecznie – tylko właściciel może edytować swoją ofertę
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-number">📍</div>
            <div className="stat-text">
              Lokalizacje na mapie – szybciej znajdziesz coś blisko siebie
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-number">🤝</div>
            <div className="stat-text">
              Lokalne wsparcie: usługi, sprzedaż, pomoc sąsiedzka
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="features-grid">
        <div className="feature-box">
          <div className="feature-icon">💸</div>
          <h3 className="feature-title">Sprzedaj lub kup</h3>
          <p className="feature-desc">
            Masz coś zbędnego? Wystaw w kilka sekund. Szukasz okazji? Zobacz
            co ludzie z okolicy już wystawili.
          </p>
          <Link to="/offers" className="feature-link">
            Zobacz oferty →
          </Link>
        </div>

        <div className="feature-box">
          <div className="feature-icon">🔧</div>
          <h3 className="feature-title">Usługi i pomoc</h3>
          <p className="feature-desc">
            Hydraulik, korepetycje, naprawa roweru, pomoc przy przeprowadzce.
            Pokaż czym się zajmujesz.
          </p>
          {user ? (
            <Link to="/new" className="feature-link">
              Dodaj swoją usługę →
            </Link>
          ) : (
            <Link to="/login" className="feature-link">
              Zaloguj się żeby dodać →
            </Link>
          )}
        </div>

        <div className="feature-box">
          <div className="feature-icon">🗺</div>
          <h3 className="feature-title">Zobacz na mapie</h3>
          <p className="feature-desc">
            Sprawdź, gdzie dokładnie znajduje się oferta. Łatwiej ustalić
            odbiór albo dojazd.
          </p>
          <Link to="/mapa" className="feature-link">
            Przejdź do mapy →
          </Link>
        </div>
      </section>

      {/* FOOT NOTE */}
      <section className="foot-note">
        <p>
          To miejsce jest stworzone dla ludzi z okolicy. Zero marketplace'u
          korpo, zero wysyłek na drugi koniec kraju. Tylko lokalnie. 💚
        </p>
      </section>
    </div>
  )
}

export default Home
