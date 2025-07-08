import { PlusCircleIcon, MapPin, CircleX, ArrowBigRight } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import leaflet from "leaflet";
import { type LngLatAlt } from "mapillary-js";
import { useNavigate } from "react-router-dom";

interface ModalProps {
  scoreState: number;
  roundNumberState: number;
  locationId: string;
  setScoreState: React.Dispatch<React.SetStateAction<number>>;
  setRoundNumberState: React.Dispatch<React.SetStateAction<number>>;
  setRoundOverState: React.Dispatch<React.SetStateAction<boolean>>;
  guessLocation: leaflet.LatLng | null;
  realLocation: LngLatAlt | null;
  numRounds: number;
}

function RoundResultModal({
  scoreState,
  roundNumberState,
  locationId,
  setScoreState,
  setRoundNumberState,
  setRoundOverState,
  guessLocation,
  realLocation,
  numRounds,
}: ModalProps) {
  const navigate = useNavigate();
  const [roundScore, setRoundScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const mapSize = 2000;
  const mapRef = useRef<leaflet.Map | null>(null);

  const mapOptions: leaflet.MapOptions = {
    center: leaflet.latLng(0, 0),
    zoom: 1,
  };

  useEffect(() => {
    mapRef.current = leaflet.map("result-map", mapOptions);

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

  //   useEffect(() => {

  //     calcDistanceScore();
  //   }, [guessLocation]);

  useEffect(() => {
    mapRef.current?.eachLayer((layer) => {
      if (layer instanceof leaflet.Marker) {
        layer.remove();
      }
    });

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

    calcDistanceScore();

    mapRef.current &&
      guessLocation &&
      new leaflet.Marker(guessLocation).addTo(mapRef.current);

    mapRef.current &&
      realLocation &&
      new leaflet.Marker(realLocation, { icon: redIcon })
        .addTo(mapRef.current)
        .on("click", () =>
          window.open(
            `https://www.mapillary.com/app/?pKey=${locationId}&focus=photo`,
            "_blank"
          )
        );
  }, [guessLocation, realLocation]);

  function calcDistanceScore() {
    if (guessLocation && realLocation) {
      let distanceCopy = Number(
        (guessLocation.distanceTo(realLocation) / 1000).toFixed(1)
      );
      setDistance(distanceCopy);
      setRoundScore(
        Number((5000 * Math.E ** ((-1 * distanceCopy) / mapSize)).toFixed(0))
      );
      mapRef.current?.fitBounds([
        [guessLocation.lat, guessLocation.lng],
        [realLocation.lat, realLocation.lng],
      ]);
    }
  }

  function startNextRound(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    (
      document.getElementById("round_result_modal") as HTMLDialogElement
    ).close();
    setRoundNumberState(roundNumberState + 1);
    setScoreState(scoreState + roundScore);
    setRoundOverState(false);
  }

  function endGame(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    (
      document.getElementById("round_result_modal") as HTMLDialogElement
    ).close();
    (document.getElementById("game_summary_modal") as HTMLDialogElement).show();
  }

  return (
    <dialog id="round_result_modal" className="modal z-1000">
      <div className="modal-box max-h-11/12 min-w-8/12 h-11/12 w-8/12">
        {/* MODAL MAP */}
        <h1 className="font-extrabold text-3xl text-center mb-4">
          Round {roundNumberState}
        </h1>
        <div id="result-map-container" className="h-7/12 w-full rounded-2xl">
          <div
            id="result-map"
            className="relative size-full rounded-2xl z-100"
          ></div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="font-extrabold text-xl text-center mt-4 mb-4">
            {roundScore} points
          </h3>
          <progress
            className="progress progress-accent w-11/12"
            value={roundScore}
            max="5000"
          ></progress>
          <p className="mt-4 font-bold">
            You were
            <span className="text-secondary"> {distance} </span>kilometers away
            from the&nbsp;
            <a
              href={`https://www.mapillary.com/app/?pKey=${locationId}&focus=photo`}
              target="_blank"
              className="transition duration-300 ease-in-out hover:text-secondary"
            >
              actual location
            </a>
            .
          </p>
          <form
            className="space-y-6"
            onSubmit={(e) =>
              roundNumberState == numRounds ? endGame(e) : startNextRound(e)
            }
          >
            {/* MODAL ACTIONS */}
            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary font-bold transition 
            duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
              >
                {roundNumberState == numRounds ? "Game Summary" : "Next Round"}
                <ArrowBigRight className="size-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default RoundResultModal;
