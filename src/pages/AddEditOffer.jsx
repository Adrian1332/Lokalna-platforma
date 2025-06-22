import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { categories } from '../data/categories'
import '../styles/AddEditOffer.scss'

const AddEditOffer = ({ offers, setOffers }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    address: ''
  })

  useEffect(() => {
    if (id) {
      const existing = offers.find(o => o.id === id)
      if (existing) setForm(existing)
    }
  }, [id, offers])

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.address)}`)
      const data = await response.json()

      if (!data.length) {
        alert('Nie znaleziono adresu')
        return
      }

      const { lat, lon } = data[0]
      const updated = { ...form, lat: parseFloat(lat), lng: parseFloat(lon) }

      if (id) {
        setOffers(prev => prev.map(o => o.id === id ? updated : o))
      } else {
        setOffers(prev => [...prev, { ...updated, id: Date.now().toString() }])
      }

      navigate('/')
    } catch (err) {
      alert('Błąd geokodowania')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="offer-form">
      <h2>{id ? 'Edytuj ofertę' : 'Nowa oferta'}</h2>
      <input type="text" name="title" placeholder="Tytuł" value={form.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Opis" value={form.description} onChange={handleChange} required />
      <select name="category" value={form.category} onChange={handleChange} required>
        <option value="">Wybierz kategorię</option>
        {categories.map(cat => <option key={cat}>{cat}</option>)}
      </select>
      <input type="text" name="address" placeholder="Adres (np. Wrocław, ul. ...)" value={form.address} onChange={handleChange} required />
      <button type="submit">Zapisz</button>
    </form>
  )
}

export default AddEditOffer
