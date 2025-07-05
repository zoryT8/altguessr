import { Link } from "react-router-dom";

function HomePage() {
  return (
    <main className="max-w-6xl mx-auto min-h-screen flex justify-center items-center px-4 py-8">
      <div className="flex flex-col gap-16">
        <div>
          <div className="text-center text-6xl font-extrabold">AltGuessr</div>
          <div className="py-2 text-center text-xl font-bold text-gray-400">
            A 100% free Geoguessr clone using Mapillary
          </div>
        </div>
        <div className="flex flex-col justify-evenly items-center gap-6 mb-8">
          <Link to="/play">
            <button
              className="btn btn-primary w-2xl py-8 text-2xl transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            >
              SINGLEPLAYER
            </button>
          </Link>
          <Link to="/">
            <button
              className="btn btn-secondary w-2xl py-8 text-2xl transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
            >
              MULTIPLAYER
            </button>
          </Link>
          <div className="map-button-container">
            <Link to="/maps">
              <button
                className="btn btn-accent w-2xl py-8 text-2xl text-white transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              >
                VIEW MAPS
              </button>
            </Link>
            <div className="py-2 text-center text-xl font-bold">
              Map Currently Selected:
              <Link to="/maps/" className="mx-1 text-accent">
                <button className="transition duration-300 ease-in-out cursor-pointer hover:text-accent-content">
                  World
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
