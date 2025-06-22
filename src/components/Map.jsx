import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import '../styles/MapPage.scss'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

const MapPage = ({ offers }) => {
  return (
    <div className="map-container">
      <MapContainer center={[51.0755, 17.0225]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {offers.map(offer => (
          <Marker key={offer.id} position={[offer.lat, offer.lng]}>
            <Popup>
              <strong>{offer.title}</strong><br />
              {offer.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapPage