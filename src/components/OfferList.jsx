import { Link } from 'react-router-dom'
import { useState } from 'react'
import { categories } from '../data/categories'
import '../styles/OfferList.scss'

const OfferList = ({ offers, deleteOffer }) => {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  const filtered = offers.filter(o =>
    (!category || o.category === category) &&
    (o.title.toLowerCase().includes(query.toLowerCase()) || o.description.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className="offer-list-container">
      <h2 className="section-heading">Lista ofert</h2>
      <input
        placeholder="Szukaj..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Wszystkie kategorie</option>
        {categories.map(cat => <option key={cat}>{cat}</option>)}
      </select>
      <ul>
        {filtered.map(offer => (
          <li key={offer.id}>
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>
            <p className="category">{offer.category}</p>
            <div className="actions">
              <Link to={`/edit/${offer.id}`}>Edytuj</Link>
              <button
                onClick={() => {
                  if (window.confirm('Czy na pewno chcesz usunąć tę ofertę?')) {
                    deleteOffer(offer.id)
                  }
                }}
              >Usuń</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OfferList