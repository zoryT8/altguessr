import { CircleCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import leaflet from "leaflet";
import { useNavigate } from "react-router-dom";
import type { RoundResult } from "../pages/PlayPage";

interface ModalProps {
  totalScore: number;
  roundResults: RoundResult[];
  numRounds: number;
  gameOver: boolean;
}

function GameSummaryModal({
  totalScore,
  roundResults,
  numRounds,
  gameOver,
}: ModalProps) {
  const navigate = useNavigate();
  const mapRef = useRef<leaflet.Map | null>(null);

  const mapOptions: leaflet.MapOptions = {
    center: leaflet.latLng(0, 0),
    zoom: 1,
  };

  useEffect(() => {
    mapRef.current = leaflet.map("summary-map", mapOptions);

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

    // Destroy the instance should the component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    const redIcon = new leaflet.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    console.log(mapRef.current);
    console.log(roundResults);

    if (mapRef.current) {
      for (let i = 0; i < roundResults.length; i++) {
        const roundResult = roundResults[i];
        new leaflet.Marker(roundResult.guessLocation!)
          .addTo(mapRef.current)
          .bindTooltip(`Round ${i + 1} Guess`, {
            permanent: false,
            direction: "top",
          });

        new leaflet.Marker(roundResult.realLocation!, { icon: redIcon })
          .addTo(mapRef.current)
          .bindTooltip(`Round ${i + 1} Actual`, {
            permanent: false,
            direction: "top",
          })
          .on("click", () =>
            window.open(
              `https://www.mapillary.com/app/?pKey=${roundResult.locationId}&focus=photo`,
              "_blank"
            )
          );
      }
    }
  }, [gameOver]);

  return (
    <dialog id="game_summary_modal" className="modal z-1001">
      <div className="modal-box max-h-11/12 min-w-8/12 h-11/12 w-8/12">
        {/* MODAL MAP */}
        <h1 className="font-extrabold text-3xl text-center mb-4">
          Game Summary
        </h1>
        <div id="summary-map-container" className="h-7/12 w-full rounded-2xl">
          <div
            id="summary-map"
            className="relative size-full rounded-2xl z-100"
          ></div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="font-extrabold text-xl text-center mt-4 mb-4">
            You got<span className="text-accent"> {totalScore} </span>points out
            of a possible{" "}
            <span className="text-secondary"> {5000 * numRounds}</span>.
          </h3>
          <progress
            className="progress progress-accent w-11/12"
            value={totalScore}
            max={`${5000 * numRounds}`}
          ></progress>
          <p className="mt-4 font-bold">
            Click on any red marker to see the actual location on Mapillary.
          </p>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            {/* MODAL ACTIONS */}
            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary font-bold transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              >
                Finish
                <CircleCheck className="size-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default GameSummaryModal;
