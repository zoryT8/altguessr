import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelectedMapStore } from "../store/useSelectedMapStore";

function HomePage() {
  const { selectedMapId, selectedMapName, setSelectedMap } =
    useSelectedMapStore();

  return (
    <div className="min-h-screen max-h-screen">
      <Navbar></Navbar>
      <main className="max-w-6xl mx-auto flex justify-center items-center px-4 py-8">
        <div className="flex flex-col gap-16">
          <div>
            <div className="text-center text-6xl font-extrabold">AltGuessr</div>
            <div className="py-2 text-center text-xl font-bold text-gray-400">
              A 100% free GeoGuessr clone using Mapillary
            </div>
          </div>
          <div className="flex flex-col justify-evenly items-center gap-6 mb-8">
            <Link to="/play">
              <button
                className="btn btn-primary w-2xl py-8 text-2xl font-bold transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              >
                SINGLEPLAYER
              </button>
            </Link>
            <Link to="/">
              <button
                className="btn btn-secondary w-2xl py-8 text-2xl font-bold transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              >
                MULTIPLAYER
              </button>
            </Link>
            <div className="map-button-container">
              <Link to="/maps">
                <button
                  className="btn btn-accent w-2xl py-8 text-2xl font-bold text-white transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                >
                  VIEW MAPS
                </button>
              </Link>
              <div className="py-2 text-center text-xl font-bold">
                Map Currently Selected:
                <Link
                  to={`/maps/${selectedMapId}`}
                  className="mx-1 text-accent"
                >
                  <button className="transition duration-300 ease-in-out cursor-pointer hover:text-accent-content">
                    {selectedMapName}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
