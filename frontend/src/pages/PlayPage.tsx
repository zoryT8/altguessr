import { House } from "lucide-react";
import LeafletMap from "../components/LeafletMap";
import MapillaryStreetViewer from "../components/MapillaryStreetViewer";
import { Link } from "react-router-dom";

function PlayPage() {
  return (
    <>
      <Link to="/">
        <button
          className="btn btn-soft absolute top-2 left-2 z-1000 transition 
      duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
        >
          <House></House>AltGuessr
        </button>
      </Link>
      <div className="relative">
        <MapillaryStreetViewer
          accessToken={import.meta.env.VITE_MAPILLARY_ACCESS}
          imageId="895438841335854"
        ></MapillaryStreetViewer>
        <LeafletMap></LeafletMap>
      </div>
    </>
  );
}

export default PlayPage;
