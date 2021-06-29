import { LatLngExpression } from 'leaflet';
import { MapContainer, CircleMarker, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap(props: any) {
    // Default coordinates set to Oslo central station
    const position: LatLngExpression = [59.91174337077401, 10.750425582038146];
    const zoom: number = 4.4;

    const data = props.lists;

    return (
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={false}>
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" />
            {data.map((item: any, k: number) => (
                <CircleMarker
                    key={k}
                    center={[item.latitude, item.longitude]}
                    radius={15}
                    fillOpacity={0.7}
                    stroke={false}
                >
                    <Tooltip direction="top" opacity={1}>
                        <div className="tiprow">
                            <div className="tipcol_1">Property Name:</div>
                            <div className="tipcol">{`${item.propertyName}`}</div>
                        </div>
                        <div className="tiprow">
                            <div className="tipcol_1">Location:</div>
                            <div className="tipcol">{`${item.location}`}</div>
                        </div>
                    </Tooltip>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}
