import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import '../styles/MapPage.scss'
import 'leaflet/dist/leaflet.css'

// naprawa ikon Leaflet (Vite issue)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

// nasłuchuje ruchu mapy (zmiana zasięgu)
const MapBoundsWatcher = ({ onBoundsChange }) => {
  useMapEvents({
    moveend(e) {
      onBoundsChange(e.target.getBounds())
    },
    zoomend(e) {
      onBoundsChange(e.target.getBounds())
    },
  })
  return null
}

const MapPage = ({ offers }) => {
  // Wrocław domyślnie
  const defaultCenter = [51.1079, 17.0385]

  const mapRef = useRef(null)
  const [visibleOffers, setVisibleOffers] = useState(offers)
  const [activeOfferId, setActiveOfferId] = useState(null)

  // przy przesunięciu mapy ustal oferty w zasięgu
  const handleBoundsChange = (bounds) => {
    if (!bounds) return
    const filtered = offers.filter(o =>
      o.lat != null &&
      o.lng != null &&
      bounds.contains([o.lat, o.lng])
    )
    setVisibleOffers(filtered)
  }

  // po pierwszym załadowaniu ustaw listę aktualnie widocznych
  useEffect(() => {
    const map = mapRef.current
    if (map) {
      handleBoundsChange(map.getBounds())
    }
  }, [offers])

  // kliknięcie w ofertę z listy po lewej -> skup kamerę
  const focusOffer = (offer) => {
    const map = mapRef.current
    if (!map || !offer.lat || !offer.lng) return
    map.flyTo([offer.lat, offer.lng], 16, { duration: 0.6 })
    setActiveOfferId(offer.id)
  }

  // markery na mapie
  const markers = useMemo(
    () =>
      offers
        .filter(o => o.lat && o.lng)
        .map(o => (
          <Marker key={o.id} position={[o.lat, o.lng]}>
            <Popup>
              <strong>{o.title}</strong>
              <br />
              {o.description}
              {o.address && (
                <>
                  <br />
                  <small>{o.address}</small>
                </>
              )}
            </Popup>
          </Marker>
        )),
    [offers]
  )

  return (
    <div className="map-page-layout">
      {/* lista ofert po lewej */}
      <aside className="map-sidebar">
        <h2>Oferty w tym obszarze</h2>

        <p className="sidebar-info">
          {visibleOffers.length
            ? `${visibleOffers.length} ofert(y) widocznych`
            : 'Brak ofert w tym obszarze'}
        </p>

        <ul className="sidebar-list">
          {visibleOffers.map(offer => (
            <li
              key={offer.id}
              className={`sidebar-item ${offer.id === activeOfferId ? 'active' : ''}`}
              onClick={() => focusOffer(offer)}
            >
              <strong>{offer.title}</strong>
              <p>{offer.description}</p>
              {offer.address && <small>{offer.address}</small>}
            </li>
          ))}
        </ul>
      </aside>

      {/* mapa po prawej */}
      <div className="map-wrapper">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          className="map-el"
          whenCreated={(map) => { mapRef.current = map }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <MapBoundsWatcher onBoundsChange={handleBoundsChange} />

          {markers}
        </MapContainer>
      </div>
    </div>
  )
}

export default MapPage
