import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MapPage = ({ offers }) => (
  <div className="h-[80vh] w-[82%] mx-auto mt-5 p-4 border rounded-2xl shadow-md">
    <MapContainer center={[51.0755, 17.0225]} zoom={13} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {offers.map((offer) =>
        offer.position ? (
          <Marker key={offer.id} position={offer.position}>
            <Popup>
              <strong>{offer.title}</strong><br />
              {offer.description}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  </div>
)

export default MapPage