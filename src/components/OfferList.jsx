import { Link } from 'react-router-dom'
import { useState } from 'react'
import { categories } from '../data/categories'
import '../styles/OfferList.scss'
import { useAuth } from '../context/AuthContext'

const OfferList = ({ offers, deleteOffer }) => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const { user } = useAuth()

  const filtered = offers.filter(o =>
    (!category || o.category === category) &&
    (
      o.title.toLowerCase().includes(query.toLowerCase()) ||
      o.description.toLowerCase().includes(query.toLowerCase())
    )
  )

  return (
    <div className="offer-list-container">
      <h2 className="section-heading">Lista ofert</h2>

      <div className="filters">
        <input
          placeholder="Szukaj..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Wszystkie kategorie</option>
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>
      </div>

      <ul>
        {filtered.map(offer => {
          const canEdit = user && user.uid === offer.ownerUid // 👈 tylko właściciel

          return (
            <li key={offer.id}>
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <p className="category">{offer.category}</p>

              {canEdit && (
                <div className="actions">
                  <Link to={`/edit/${offer.id}`}>Edytuj</Link>
                  <button
                    onClick={() => {
                      if (window.confirm('Czy na pewno chcesz usunąć tę ofertę?')) {
                        deleteOffer(offer.id)
                      }
                    }}
                  >
                    Usuń
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {user ? (
        <Link to="/new" className="add-offer-cta">+ Dodaj nową ofertę</Link>
      ) : (
        <p className="login-hint">
          Żeby dodać ofertę musisz być zalogowany. <Link to="/login">Zaloguj się</Link>
        </p>
      )}
    </div>
  )
}

export default OfferList
