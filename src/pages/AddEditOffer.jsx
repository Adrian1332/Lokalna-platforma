import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { categories } from '../data/categories'
import { createOffer, updateOffer } from '../services/offersService'
import { useAuth } from '../context/AuthContext'
import '../styles/AddEditOffer.scss'
import 'leaflet/dist/leaflet.css'

// naprawa ikonek Leaflet w bundlerze
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

const AddEditOffer = ({ offers, setOffers }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const editing = Boolean(id)

  // aktualnie edytowana oferta (albo null jeśli tworzymy nową)
  const existing = useMemo(
    () => (editing ? offers.find(o => o.id === id) : null),
    [editing, offers, id]
  )

  // BLOKADA dostępu dla nie-właściciela:
  // - jeśli nie ma takiej oferty -> wróć /
  // - jeśli nie ma usera -> wróć /
  // - jeśli oferta ma ownerUid i nie jest moja -> wróć /
  //
  // UWAGA: jeśli oferta jest stara i nie ma ownerUid,
  //        pozwalamy ją otworzyć, żeby przy zapisie przypisać właściciela.
  useEffect(() => {
    if (!editing) return

    if (!existing) {
      navigate('/')
      return
    }

    if (!user) {
      navigate('/')
      return
    }

    if (existing.ownerUid && existing.ownerUid !== user.uid) {
      navigate('/')
    }
  }, [editing, existing, user, navigate])

  // pola formularza
  const [title, setTitle] = useState(existing?.title || '')
  const [description, setDescription] = useState(existing?.description || '')
  const [category, setCategory] = useState(existing?.category || '')
  const [address, setAddress] = useState(existing?.address || '')

  // współrzędne wyliczone z adresu
  const [lat, setLat] = useState(existing?.lat || null)
  const [lng, setLng] = useState(existing?.lng || null)

  // helpery UI
  const [geoError, setGeoError] = useState('')
  const [formError, setFormError] = useState('')
  const [geocodingInProgress, setGeocodingInProgress] = useState(false)

  // geokodowanie adresu -> lat/lng
  const handleGeocodeAddress = async () => {
    setGeoError('')
    setGeocodingInProgress(true)

    if (!address.trim()) {
      setGeoError('Podaj adres, np. "Rynek 1, Wrocław"')
      setGeocodingInProgress(false)
      return
    }

    try {
      const res = await fetch(
        `/nominatim/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=1`
      )

      if (!res.ok) {
        setGeoError(
          'Nie udało się połączyć z serwisem geolokalizacji. Spróbuj ponownie za chwilę.'
        )
        setGeocodingInProgress(false)
        return
      }

      const data = await res.json()

      if (!data || data.length === 0) {
        setGeoError('Nie znaleziono takiego adresu. Doprecyzuj ulicę i miasto.')
        setGeocodingInProgress(false)
        return
      }

      const found = data[0]
      const newLat = Number(found.lat).toFixed(6)
      const newLng = Number(found.lon).toFixed(6)

      setLat(newLat)
      setLng(newLng)
      setGeoError('')
    } catch (err) {
      console.error('Geocoding error:', err)
      setGeoError('Błąd podczas wyszukiwania adresu.')
    } finally {
      setGeocodingInProgress(false)
    }
  }

  // zapis do Firestore (dodanie albo aktualizacja)
  const save = async (e) => {
    e.preventDefault()
    setFormError('')

    // walidacja
    if (!title.trim() || !description.trim() || !category.trim()) {
      setFormError('Uzupełnij tytuł, opis i kategorię.')
      return
    }

    if (!address.trim()) {
      setFormError('Adres jest wymagany.')
      return
    }

    if (!lat || !lng) {
      setFormError(
        'Najpierw kliknij "Ustaw lokalizację z adresu", żeby ustawić pinezkę na mapie.'
      )
      return
    }

    if (!user) {
      setFormError('Musisz być zalogowany.')
      return
    }

    // dane do zapisania
    const baseData = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      address: address.trim(),
      lat: Number(lat),
      lng: Number(lng),
    }

    try {
      if (editing) {
        // jeśli oferta nie miała jeszcze ownerUid (stara oferta sprzed zmian),
        // to przy tej pierwszej edycji przypisujemy ją do aktualnego usera,
        // żeby od teraz tylko on mógł ją ruszać
        const dataToUpdate = existing.ownerUid
          ? baseData
          : {
              ...baseData,
              ownerUid: user.uid,
              ownerEmail: user.email || null,
            }

        await updateOffer(id, dataToUpdate, user.uid)

        // aktualizacja stanu lokalnego
        setOffers(prev =>
          prev.map(o =>
            o.id === id
              ? { ...o, ...dataToUpdate }
              : o
          )
        )
      } else {
        // tworzenie nowej oferty — zawsze przypisujemy właściciela
        const dataToCreate = {
          ...baseData,
          ownerUid: user.uid,
          ownerEmail: user.email || null,
        }

        const newOffer = await createOffer(dataToCreate)

        setOffers(prev => [...prev, newOffer])
      }

      navigate('/')
    } catch (err) {
      console.error('Błąd podczas zapisu oferty:', err)
      setFormError(
        'Nie udało się zapisać oferty. Sprawdź połączenie z bazą / uprawnienia.'
      )
    }
  }

  return (
    <div className="offer-form">
      <h2>{editing ? 'Edytuj ofertę' : 'Dodaj ofertę'}</h2>

      <form onSubmit={save} className="form-inner">
        {/* Tytuł */}
        <label>Tytuł</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        {/* Opis */}
        <label>Opis</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />

        {/* Kategoria */}
        <label>Kategoria</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        >
          <option value="">-- wybierz --</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Adres */}
        <label>Adres (ulica, miasto)</label>
        <input
          type="text"
          placeholder='np. "Rynek 1, Wrocław"'
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
        />

        <button
          type="button"
          className="geo-btn"
          onClick={handleGeocodeAddress}
          disabled={geocodingInProgress}
        >
          {geocodingInProgress
            ? 'Szukanie lokalizacji...'
            : 'Ustaw lokalizację z adresu'}
        </button>

        {geoError && (
          <div className="geo-error">{geoError}</div>
        )}

        {/* Mapa podglądu lokalizacji */}
        <label>Lokalizacja na mapie</label>
        <p className="map-picker-hint">
          Pinezka pojawi się po ustawieniu adresu. Lokalizacji nie można
          zmieniać ręcznie.
        </p>

        <div className="map-picker-wrapper">
          <MapContainer
            center={[
              lat ? Number(lat) : 51.0755,
              lng ? Number(lng) : 17.0225,
            ]}
            zoom={lat && lng ? 16 : 13}
            scrollWheelZoom={true}
            className="map-picker-map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {lat && lng && (
              <Marker position={[Number(lat), Number(lng)]} />
            )}
          </MapContainer>
        </div>

        {lat && lng && (
          <div className="coords-hint">
            <small>
              Ustalona lokalizacja: {lat}, {lng}
            </small>
          </div>
        )}

        {formError && (
          <div className="geo-error">{formError}</div>
        )}

        {/* Przyciski akcji */}
        <div className="form-actions-row">
          <button type="submit" className="submit-offer-btn">
            {editing ? 'Zapisz zmiany' : 'Dodaj ofertę'}
          </button>

          {editing && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/')}
            >
              Anuluj
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AddEditOffer
