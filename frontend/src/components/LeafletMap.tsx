import leaflet from "leaflet";
import { useEffect, useRef, useState } from "react";
import "@maptiler/leaflet-maptilersdk";
import { MapPin } from "lucide-react";

interface LeafletMapProps {
  setGuessLocation: (latlng: leaflet.LatLng) => void;
}

function LeafletMap({ setGuessLocation }: LeafletMapProps) {
  const [showPlacePinAlert, setShowPlacePinAlert] = useState<boolean>(false);
  const pinRef = useRef<leaflet.Marker | null>(null);
  const mapRef = useRef<leaflet.Map | null>(null);

  const mapOptions: leaflet.MapOptions = {
    center: leaflet.latLng(0, 0),
    zoom: 1,
  };

  useEffect(() => {
    if (showPlacePinAlert) {
      setTimeout(function () {
        setShowPlacePinAlert(false);
      }, 2500);
    }
  }, [showPlacePinAlert]);

  useEffect(() => {
    mapRef.current = leaflet.map("map", mapOptions);

    leaflet
      .tileLayer(
        `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${
          import.meta.env.VITE_MAPTILER_KEY
        }`,
        {
          tileSize: 512,
          zoomOffset: -1,
          minZoom: 1,
          attribution:
            '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
          crossOrigin: true,
        }
      )
      .addTo(mapRef.current);

    mapRef.current.on("click", onMapClick);

    // Destroy the instance should the component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  function onMapClick(e: leaflet.LeafletMouseEvent) {
    if (pinRef.current && mapRef.current) {
      pinRef.current.setLatLng(e.latlng);
    } else if (mapRef.current) {
      pinRef.current = new leaflet.Marker(e.latlng).addTo(mapRef.current);
    }
  }

  function handleGuess(e: React.MouseEvent<HTMLElement>): void {
    e.preventDefault();
    if (pinRef.current) {
      setGuessLocation(pinRef.current.getLatLng());
      mapRef.current?.eachLayer((layer) => {
        if (layer instanceof leaflet.Marker) {
          layer.remove();
          pinRef.current = null;
        }
      });
      mapRef.current?.setView([0, 0], 1);
    } else {
      setShowPlacePinAlert(true);
    }
  }

  return (
    <>
      <div
        id="map-container"
        className="fixed left-2 bottom-2 size-64 rounded-2xl z-100
      opacity-50 hover:opacity-100 hover:w-192 hover:h-96 transition duration-300 ease-in-out"
      >
        <div
          id="map"
          className="relative size-full rounded-2xl z-100"
          onMouseOver={() => {
            mapRef !== null && mapRef.current !== null
              ? mapRef.current.invalidateSize()
              : null;
          }}
          onMouseOut={() => {
            mapRef !== null && mapRef.current !== null
              ? mapRef.current.invalidateSize()
              : null;
          }}
        ></div>
        <button
          className={`btn btn-soft absolute top-3 right-3 z-200 font-bold transition duration-300 ease-in-out ${
            true ? "hover:-translate-y-1 hover:scale-110" : ""
          }`}
          disabled={false}
          onClick={handleGuess}
        >
          <MapPin></MapPin>Guess
        </button>
        {showPlacePinAlert && (
          <div
            role="alert"
            className="absolute top-3 z-201 left-1/2 transform -translate-x-1/2 alert alert-error"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>You must first place a pin on the map to guess.</span>
          </div>
        )}
      </div>
    </>
  );
}

export default LeafletMap;
